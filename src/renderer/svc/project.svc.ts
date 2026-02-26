/**
 * プロジェクト開閉・タブ切替
 */

import { toast } from "sonner";
import * as api from "../lib/api";
import { useAppStore } from "../store";
import type { ProjectData, OutdatedEntry, AuditResult } from "../types";

/**
 * プロジェクトを開き、outdated / audit を並列取得してタブに反映
 */
export async function openProject(dir: string): Promise<void> {
  // React Hook ではなく Zustand インスタンスを直接参照（コンポーネント外から呼ぶため）
  const store = useAppStore;
  const { tabs } = store.getState();

  // 重複チェック: 既に開いていればそのタブをアクティブにする
  const existing = tabs.findIndex((t) => t.dir === dir);
  if (existing !== -1) {
    store.getState().setActiveTab(existing);
    return;
  }

  // 先にタブを追加して UI にローディング状態を見せてから非同期取得を開始する
  store.getState().addTab({
    dir,
    data: null,
    outdated: [],
    audit: null,
    tree: null,
    dirty: false,
    loading: true,
  });

  const tabIndex = store.getState().tabs.length - 1;

  try {
    // 3 つの取得を並列実行して初期表示を高速化する
    const [data, outdated, audit] = await Promise.all([
      api.loadProject(dir) as Promise<ProjectData>,
      api.getOutdated(dir) as Promise<OutdatedEntry[]>,
      api.getAudit(dir) as Promise<AuditResult>,
    ]);

    store.getState().updateTab(tabIndex, {
      data,
      outdated,
      audit,
      loading: false,
    });
  } catch {
    // package.json がない等で読み込み不可→タブを消してトーストで通知
    store.getState().removeTab(tabIndex);
    toast.error("package.json が見つかりません", {
      description: dir,
    });
  }
}

/**
 * ディレクトリ選択ダイアログ経由でプロジェクトを開く
 */
export async function selectAndOpenProject(): Promise<void> {
  const dir = (await api.selectDirectory()) as string | null;
  if (dir) {
    await openProject(dir);
  }
}

/**
 * タブを閉じる
 */
export function closeProject(index: number): void {
  useAppStore.getState().removeTab(index);
}

/**
 * タブ切替
 */
export function switchTab(index: number): void {
  useAppStore.getState().setActiveTab(index);
}
