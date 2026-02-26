/**
 * renderer → main プロセスへの IPC 呼び出しレイヤー
 * コンポーネントから直接 window.electronApi を参照しないよう、ここで一元化する
 */

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
export function loadProject(dir: string) {
  return getApi().loadProject(dir);
}

/**
 * npm outdated 相当。更新可能なパッケージ一覧を返す
 */
export function getOutdated(dir: string) {
  return getApi().getOutdated(dir);
}

/**
 * レジストリから各パッケージの最新メタ情報を取得する
 */
export function getLatestVersions(names: string[], registryUrl: string) {
  return getApi().getLatestVersions(names, registryUrl);
}

/**
 * npm audit を実行し脆弱性情報を返す
 */
export function getAudit(dir: string) {
  return getApi().getAudit(dir);
}

/**
 * npm ls --all 相当。依存ツリーを返す
 */
export function getDependencyTree(dir: string, depth?: number) {
  return getApi().getDependencyTree(dir, depth);
}

/**
 * 編集後の package.json をディスクに書き込む
 */
export function savePackageJson(dir: string, data: unknown) {
  return getApi().savePackageJson(dir, data);
}

/**
 * レジストリのパッケージ検索
 */
export function searchRegistry(query: string) {
  return getApi().searchRegistry(query);
}

/**
 * ネイティブダイアログでディレクトリを選択する
 */
export function selectDirectory() {
  return getApi().selectDirectory();
}
