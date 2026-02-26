/**
 * preload スクリプト — renderer に公開する IPC ブリッジ
 * renderer から直接 ipcRenderer を触れないため、contextBridge 経由で安全に公開する
 */
import { contextBridge, ipcRenderer } from "electron";

const api = {
  loadProject: (dir: string) => ipcRenderer.invoke("load-project", dir),
  getOutdated: (dir: string) => ipcRenderer.invoke("get-outdated", dir),
  getLatestVersions: (names: string[], registryUrl: string) =>
    ipcRenderer.invoke("get-latest-versions", names, registryUrl),
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
