import { ipcMain } from "electron";
import { loadProject, savePackageJson } from "./svc/project.svc";
import {
  getOutdated,
  getAudit,
  getDependencyTree,
  searchRegistry,
} from "./svc/npm.svc";
import { selectDirectory } from "./svc/dialog.svc";

/** すべての IPC ハンドラを登録する */
export function registerIpcHandlers(): void {
  ipcMain.handle("load-project", (_e, dir: string) => loadProject(dir));
  ipcMain.handle("save-package-json", (_e, dir, data) =>
    savePackageJson(dir, data),
  );
  ipcMain.handle("get-outdated", (_e, dir: string) => getOutdated(dir));
  ipcMain.handle("get-audit", (_e, dir: string) => getAudit(dir));
  ipcMain.handle("get-dependency-tree", (_e, dir: string) =>
    getDependencyTree(dir),
  );
  ipcMain.handle("search-registry", (_e, query: string) =>
    searchRegistry(query),
  );
  ipcMain.handle("select-directory", () => selectDirectory());
}
