import { exec } from "node:child_process";
import type {
  AuditResult,
  OutdatedEntry,
  RegistryPackage,
  RegistryPackageMeta,
  TreeNode,
} from "../../shared/types";

/**
 * exec を Promise 化（stdout/stderr を返す）
 */
function execAsync(
  cmd: string,
  cwd: string,
): Promise<{ stdout: string; stderr: string }> {
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

  const json: Record<
    string,
    { current?: string; wanted?: string; latest?: string }
  > = JSON.parse(stdout);

  return Object.entries(json).map(([name, info]) => ({
    name,
    current: info.current ?? "",
    wanted: info.wanted ?? "",
    latest: info.latest ?? "",
  }));
}

/**
 * registry API から最新バージョンを一括取得する
 * 同時実行数を制限し、個別失敗は結果に含めない（部分成功を許容）
 */
export async function getLatestVersions(
  names: string[],
  registryUrl: string,
): Promise<Record<string, RegistryPackageMeta>> {
  const concurrency = 10;
  const result: Record<string, RegistryPackageMeta> = {};
  let cursor = 0;

  async function next(): Promise<void> {
    while (cursor < names.length) {
      const name = names[cursor++];
      try {
        const res = await fetch(`${registryUrl}/${name}/latest`);
        if (!res.ok) continue;
        const json = (await res.json()) as RegistryPackageMeta;
        if (json.version) {
          result[name] = json;
        }
      } catch {
        // 個別失敗は無視
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, names.length) },
    () => next(),
  );
  await Promise.all(workers);
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
 * TODO: 未実装
 */
export async function getDependencyTree(_dir: string): Promise<TreeNode[]> {
  return [];
}

/**
 * npm レジストリを検索
 * TODO: 未実装
 */
export async function searchRegistry(_q: string): Promise<RegistryPackage[]> {
  return [];
}
