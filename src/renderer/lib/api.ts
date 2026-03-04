/**
 * renderer → main プロセスへの IPC 呼び出しレイヤー
 * コンポーネントから直接 window.electronApi を参照しないよう、ここで一元化する
 */
import type {
  AuditResult,
  ProjectData,
  RegistryPackage,
  RegistryPackageMeta,
  TreeNode,
} from "../types";

/**
 * preload で公開された API を取得。テスト環境など electronApi がない場合はエラー
 */
function getApi(): Window["electronApi"] {
  if (!window.electronApi) {
    throw new Error("electronApi is not available");
  }
  return window.electronApi;
}

/**
 * package.json + package-lock.json を読み込みプロジェクト情報を返す
 */
export function loadProject(dir: string): Promise<ProjectData> {
  return getApi().loadProject(dir) as Promise<ProjectData>;
}

/**
 * npm outdated 相当。更新可能なパッケージ一覧を返す
 */
export function getOutdated(dir: string): Promise<import("../types").OutdatedEntry[]> {
  return getApi().getOutdated(dir) as Promise<import("../types").OutdatedEntry[]>;
}

/**
 * レジストリから各パッケージの最新メタ情報を取得する
 */
export function getLatestVersions(
  names: string[],
  registryUrl: string,
): Promise<Record<string, RegistryPackageMeta>> {
  return getApi().getLatestVersions(names, registryUrl) as Promise<
    Record<string, RegistryPackageMeta>
  >;
}

/**
 * npm audit を実行し脆弱性情報を返す
 */
export function getAudit(dir: string): Promise<AuditResult> {
  return getApi().getAudit(dir) as Promise<AuditResult>;
}

/**
 * npm ls --all 相当。依存ツリーを返す
 */
export function getDependencyTree(dir: string, depth?: number): Promise<TreeNode[]> {
  return getApi().getDependencyTree(dir, depth) as Promise<TreeNode[]>;
}

/**
 * 編集後の package.json をディスクに書き込む
 */
export function savePackageJson(dir: string, data: ProjectData) {
  return getApi().savePackageJson(dir, data);
}

/**
 * レジストリのパッケージ検索
 */
export function searchRegistry(query: string): Promise<RegistryPackage[]> {
  return getApi().searchRegistry(query) as Promise<RegistryPackage[]>;
}

/**
 * ネイティブダイアログでディレクトリを選択する
 */
export function selectDirectory(): Promise<string | null> {
  return getApi().selectDirectory() as Promise<string | null>;
}
