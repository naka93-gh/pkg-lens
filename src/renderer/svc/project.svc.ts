/**
 * プロジェクト開閉・タブ切替
 */

import { toast } from "sonner";
import * as api from "../lib/api";
import { useAppStore } from "../store";
import type { ProjectData, RegistryPackageMeta, AuditResult } from "../types";

/**
 * プロジェクトを開き、loadProject → outdated → audit を段階的に取得してタブに反映
 */
export async function openProject(dir: string): Promise<void> {
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
    latestVersions: null,
    audit: null,
    tree: null,
    dirty: false,
    loading: true,
  });

  const tabIndex = store.getState().tabs.length - 1;

  // 1. loadProject — これが失敗したらタブを消す
  let data: ProjectData;
  try {
    data = (await api.loadProject(dir)) as ProjectData;
  } catch {
    store.getState().removeTab(tabIndex);
    toast.error("package.json が見つかりません", { description: dir });
    return;
  }

  // テーブル即座描画（パッケージ名・指定ver・インストール済みver）
  store.getState().updateTab(tabIndex, { data, loading: false });

  // 2. latestVersions / audit を並列取得（個別 catch で失敗を握りつぶす）
  const allNames = [
    ...Object.keys(data.dependencies),
    ...Object.keys(data.devDependencies),
    ...Object.keys(data.peerDependencies),
  ];
  const { registryUrl } = store.getState();

  const [latestVersions, audit] = await Promise.all([
    (
      api.getLatestVersions(allNames, registryUrl) as Promise<
        Record<string, RegistryPackageMeta>
      >
    ).catch(() => null),
    (api.getAudit(dir) as Promise<AuditResult>).catch(() => null),
  ]);

  store.getState().updateTab(tabIndex, {
    ...(latestVersions !== null ? { latestVersions } : {}),
    ...(audit !== null ? { audit } : {}),
  });
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
