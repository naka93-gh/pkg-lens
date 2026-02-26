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

export function loadProject(dir: string) {
  return getApi().loadProject(dir);
}

export function getOutdated(dir: string) {
  return getApi().getOutdated(dir);
}

export function getAudit(dir: string) {
  return getApi().getAudit(dir);
}

export function getDependencyTree(dir: string, depth?: number) {
  return getApi().getDependencyTree(dir, depth);
}

export function savePackageJson(dir: string, data: unknown) {
  return getApi().savePackageJson(dir, data);
}

export function searchRegistry(query: string) {
  return getApi().searchRegistry(query);
}

export function selectDirectory() {
  return getApi().selectDirectory();
}
