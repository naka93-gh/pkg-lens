import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, shell } from "electron";
import { join } from "node:path";
import { registerIpcHandlers } from "./ipc";

/**
 * ウィンドウを作成する
 */
function createWindow(): BrowserWindow {
  const isMac = process.platform === "darwin";
  const isWin = process.platform === "win32";

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    // Ghostty 風の半透明ウィンドウを実現するため、Chromium の背景を完全透明にする
    transparent: true,
    backgroundColor: "#00000000",
    ...(isMac && {
      // macOS: ウィンドウ背後のデスクトップをぼかして透かす
      vibrancy: "under-window" as const,
      // 非フォーカス時もブラーを維持（CSS 側で opacity 減光する）
      visualEffectState: "active" as const,
      // ネイティブタイトルバーを隠し、renderer 側でタブバーをドラッグ領域にする
      titleBarStyle: "hiddenInset" as const,
      trafficLightPosition: { x: 12, y: 12 },
    }),
    ...(isWin && {
      // Windows 11: Acrylic ブラー
      backgroundMaterial: "acrylic" as const,
      autoHideMenuBar: true,
    }),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      // preload で Node.js API（fs 等）を使うため sandbox を無効化
      sandbox: false,
    },
  });

  // リンククリック時は Electron 内ではなくデフォルトブラウザで開く
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return win;
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.pkg-lens");
  // F12 でDevTools等の開発用ショートカットを有効にする
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC ハンドラはウィンドウ作成前に登録（renderer の初期化で即座に使えるように）
  registerIpcHandlers();
  createWindow();

  // macOS: Dock クリックでウィンドウを再作成
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macOS 以外はウィンドウ全閉でアプリ終了（macOS は Dock に残す慣習）
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
