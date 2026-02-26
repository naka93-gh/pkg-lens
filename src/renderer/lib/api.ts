/** renderer → main プロセスへの IPC 呼び出しレイヤー */

function getApi() {
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
