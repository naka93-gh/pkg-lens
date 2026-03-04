import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { LicenseEntry, ProjectData } from "../../shared/types";

/**
 * package-lock.json の packages フィールドからインストール済みバージョンを抽出
 */
function parseInstalledVersions(lockRaw: string): Record<string, string> {
  const lock = JSON.parse(lockRaw);
  const packages: Record<string, { version?: string }> = lock.packages ?? {};
  const result: Record<string, string> = {};

  for (const [key, val] of Object.entries(packages)) {
    // "node_modules/<name>" 形式のキーからパッケージ名を取り出す
    // スコープ付き: "node_modules/@scope/pkg"
    // ネストされた依存は無視: "node_modules/foo/node_modules/bar"
    const match = key.match(/^node_modules\/([^/]+(?:\/[^/]+)?)$/);
    if (match && val.version) {
      result[match[1]] = val.version;
    }
  }

  return result;
}

/**
 * package-lock.json の packages フィールドからライセンス情報を抽出
 */
function parseLicenses(lockRaw: string): LicenseEntry[] {
  const lock = JSON.parse(lockRaw);
  const packages: Record<string, { version?: string; license?: string }> = lock.packages ?? {};
  const result: LicenseEntry[] = [];
  const PREFIX = "node_modules/";

  for (const [key, val] of Object.entries(packages)) {
    // ルートパッケージ（キー ""）はスキップ
    if (key === "") continue;

    // 最後の "node_modules/" 以降をパッケージ名として取り出す（ネスト対応）
    const lastIdx = key.lastIndexOf(PREFIX);
    if (lastIdx === -1 || !val.version) continue;

    const name = key.slice(lastIdx + PREFIX.length);
    result.push({
      name,
      version: val.version,
      license: val.license ?? "UNKNOWN",
    });
  }

  return result;
}

/**
 * package.json + package-lock.json を読み込み ProjectData を返す
 */
export async function loadProject(dir: string): Promise<ProjectData> {
  const raw = await readFile(join(dir, "package.json"), "utf-8");
  const pkg: Record<string, unknown> = JSON.parse(raw);

  // lockfile からインストール済みバージョン・ライセンス情報を取得（存在しなければ空）
  let installedVersions: Record<string, string> = {};
  let licenses: LicenseEntry[] = [];
  try {
    const lockRaw = await readFile(join(dir, "package-lock.json"), "utf-8");
    installedVersions = parseInstalledVersions(lockRaw);
    licenses = parseLicenses(lockRaw);
  } catch {
    // package-lock.json が存在しない場合は空のまま
  }

  // フィールドが省略されているケースに備えて空オブジェクトで埋める
  return {
    name: typeof pkg.name === "string" ? pkg.name : "",
    version: typeof pkg.version === "string" ? pkg.version : "0.0.0",
    dependencies: (pkg.dependencies as Record<string, string>) ?? {},
    devDependencies: (pkg.devDependencies as Record<string, string>) ?? {},
    peerDependencies: (pkg.peerDependencies as Record<string, string>) ?? {},
    installedVersions,
    licenses,
  };
}

/**
 * ProjectData を package.json に書き戻す
 */
export async function savePackageJson(dir: string, data: ProjectData): Promise<void> {
  const filePath = join(dir, "package.json");

  // 既存の package.json を読み直してマージする（scripts 等の管理外フィールドを消さないため）
  const raw = await readFile(filePath, "utf-8");
  const pkg: Record<string, unknown> = JSON.parse(raw);

  pkg.name = data.name;
  pkg.version = data.version;
  pkg.dependencies = data.dependencies;
  pkg.devDependencies = data.devDependencies;
  pkg.peerDependencies = data.peerDependencies;

  // npm の出力に合わせて 2 スペースインデント + 末尾改行
  await writeFile(filePath, `${JSON.stringify(pkg, null, 2)}\n`, "utf-8");
}
