import { exec } from "node:child_process";
import type {
  AuditResult,
  OutdatedEntry,
  RegistryPackage,
  RegistryPackageMeta,
  TreeNode,
} from "../../shared/types";
import { isExpired, loadRegistryCache, saveRegistryCache } from "./cache.svc";

/**
 * exec を Promise 化（stdout/stderr を返す）
 */
function execAsync(cmd: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        // npm outdated は outdated パッケージがあると exit code 1 を返す（正常動作）
        // stdout に JSON が入っていれば成功とみなす
        if (stdout) {
          resolve({ stdout, stderr });
          return;
        }
        reject(err);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

/**
 * npm outdated --json を実行し OutdatedEntry[] を返す
 * @deprecated getLatestVersions を使用すること
 */
export async function getOutdated(dir: string): Promise<OutdatedEntry[]> {
  const { stdout } = await execAsync("npm outdated --json", dir);
  if (!stdout.trim()) return [];

  const json: Record<string, { current?: string; wanted?: string; latest?: string }> =
    JSON.parse(stdout);

  return Object.entries(json).map(([name, info]) => ({
    name,
    current: info.current ?? "",
    wanted: info.wanted ?? "",
    latest: info.latest ?? "",
  }));
}

/**
 * registry API から最新バージョンを一括取得する
 * ディスクキャッシュ（TTL 12h）を利用し、未キャッシュ分のみフェッチする
 * 同時実行数を制限し、個別失敗は結果に含めない（部分成功を許容）
 */
export async function getLatestVersions(
  names: string[],
  registryUrl: string,
): Promise<Record<string, RegistryPackageMeta>> {
  const cache = await loadRegistryCache();
  const result: Record<string, RegistryPackageMeta> = {};

  // キャッシュヒット分と未キャッシュ分を分類
  const uncached: string[] = [];
  for (const name of names) {
    const entry = cache[name];
    if (entry && !isExpired(entry)) {
      result[name] = entry.data;
    } else {
      uncached.push(name);
    }
  }

  if (uncached.length === 0) return result;

  // 未キャッシュ分のみ registry API をフェッチ
  const concurrency = 10;
  const fetched: Record<string, RegistryPackageMeta> = {};
  let cursor = 0;

  async function next(): Promise<void> {
    while (cursor < uncached.length) {
      const name = uncached[cursor++];
      try {
        const res = await fetch(`${registryUrl}/${name}/latest`);
        if (!res.ok) continue;
        const json = (await res.json()) as RegistryPackageMeta;
        if (json.version) {
          fetched[name] = json;
        }
      } catch {
        // 個別失敗は無視
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, uncached.length) }, () => next());
  await Promise.all(workers);

  // フェッチ結果をキャッシュに追加して保存
  const now = Date.now();
  for (const [name, data] of Object.entries(fetched)) {
    cache[name] = { data, cachedAt: now };
    result[name] = data;
  }
  await saveRegistryCache(cache);

  return result;
}

/**
 * npm audit 結果を取得
 * TODO: 未実装
 */
export async function getAudit(_dir: string): Promise<AuditResult> {
  return {
    advisories: [],
    metadata: {
      vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
      totalDependencies: 0,
    },
  };
}

/**
 * 依存ツリーを取得
 * @npmcli/arborist で node_modules を読み取り TreeNode[] に変換する
 */
export async function getDependencyTree(dir: string): Promise<TreeNode[]> {
  const Arborist = (await import("@npmcli/arborist")).default;
  const arb = new Arborist({ path: dir });

  let root: Awaited<ReturnType<typeof arb.loadActual>>;
  try {
    root = await arb.loadActual();
  } catch {
    // node_modules が存在しない場合など
    return [];
  }

  const visited = new Set<string>();

  function toTreeNode(node: typeof root): TreeNode {
    const key = `${node.name}@${node.version}`;
    if (visited.has(key)) {
      return { name: node.name ?? "", version: node.version ?? "", children: [] };
    }
    visited.add(key);

    const children: TreeNode[] = [];
    for (const edge of node.edgesOut.values()) {
      if (edge.to) {
        children.push(toTreeNode(edge.to));
      }
    }

    visited.delete(key);
    return { name: node.name ?? "", version: node.version ?? "", children };
  }

  const result: TreeNode[] = [];
  for (const edge of root.edgesOut.values()) {
    if (edge.to) {
      result.push(toTreeNode(edge.to));
    }
  }

  return result;
}

/**
 * npm レジストリを検索
 * TODO: 未実装
 */
export async function searchRegistry(_q: string): Promise<RegistryPackage[]> {
  return [];
}
