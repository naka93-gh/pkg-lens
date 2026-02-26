import { BrowserWindow, dialog } from "electron";

/**
 * ディレクトリ選択ダイアログを開く
 */
export async function selectDirectory(): Promise<string | null> {
  // macOS ではウィンドウを渡すとシートダイアログとして表示される
  const win = BrowserWindow.getFocusedWindow();
  const opts: Electron.OpenDialogOptions = {
    properties: ["openDirectory"],
    title: "プロジェクトフォルダを選択",
  };

  const result = win
    ? await dialog.showOpenDialog(win, opts)
    : await dialog.showOpenDialog(opts);

  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
}
