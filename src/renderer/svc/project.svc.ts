/** プロジェクト開閉・タブ切替 */

import * as api from "../lib/api";
import { useAppStore } from "../store";
import type { ProjectData, OutdatedEntry, AuditResult } from "../types";

/** プロジェクトを開き、outdated / audit を並列取得してタブに反映 */
export async function openProject(dir: string): Promise<void> {
  const store = useAppStore;

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
  } catch (error) {
    store.getState().updateTab(tabIndex, { loading: false });
    throw error;
  }
}

/** ディレクトリ選択ダイアログ経由でプロジェクトを開く */
export async function selectAndOpenProject(): Promise<void> {
  const dir = (await api.selectDirectory()) as string | null;
  if (dir) {
    await openProject(dir);
  }
}

/** タブを閉じる */
export function closeProject(index: number): void {
  useAppStore.getState().removeTab(index);
}

/** タブ切替 */
export function switchTab(index: number): void {
  useAppStore.getState().setActiveTab(index);
}
