import { contextBridge, ipcRenderer } from "electron";

const api = {
  loadProject: (dir: string) => ipcRenderer.invoke("load-project", dir),
  getOutdated: (dir: string) => ipcRenderer.invoke("get-outdated", dir),
  getAudit: (dir: string) => ipcRenderer.invoke("get-audit", dir),
  getDependencyTree: (dir: string, depth?: number) =>
    ipcRenderer.invoke("get-dependency-tree", dir, depth),
  savePackageJson: (dir: string, data: unknown) =>
    ipcRenderer.invoke("save-package-json", dir, data),
  searchRegistry: (query: string) =>
    ipcRenderer.invoke("search-registry", query),
  selectDirectory: () => ipcRenderer.invoke("select-directory"),
};

export type ElectronApi = typeof api;

contextBridge.exposeInMainWorld("electronApi", api);
