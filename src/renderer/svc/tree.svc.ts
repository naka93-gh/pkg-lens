/** 依存ツリーデータ取得 */

import * as api from "../lib/api";
import { useAppStore } from "../store";
import type { TreeNode } from "../types";

/** アクティブプロジェクトの依存ツリーを取得 */
export async function loadTree(depth?: number): Promise<void> {
  const { tabs, activeTabIndex } = useAppStore.getState();
  const tab = tabs[activeTabIndex];
  if (!tab) return;

  const tree = (await api.getDependencyTree(tab.dir, depth)) as TreeNode;
  useAppStore.getState().updateTab(activeTabIndex, { tree });
}
