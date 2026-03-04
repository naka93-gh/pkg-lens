/**
 * 依存ツリーデータ取得
 */

import * as api from "../lib/api";
import { useAppStore } from "../store";

/**
 * アクティブプロジェクトの依存ツリーを取得
 */
export async function loadTree(depth?: number): Promise<void> {
  const { tabs, activeTabIndex } = useAppStore.getState();
  const tab = tabs[activeTabIndex];
  if (!tab) return;

  const tree = await api.getDependencyTree(tab.dir, depth);
  useAppStore.getState().updateTab(activeTabIndex, { tree });
}
