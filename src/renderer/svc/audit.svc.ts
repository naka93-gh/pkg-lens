/** audit データ再取得 */

import * as api from "../lib/api";
import { useAppStore } from "../store";
import type { AuditResult } from "../types";

/** アクティブプロジェクトの audit 情報を再取得 */
export async function refreshAudit(): Promise<void> {
  const { tabs, activeTabIndex } = useAppStore.getState();
  const tab = tabs[activeTabIndex];
  if (!tab) return;

  const audit = (await api.getAudit(tab.dir)) as AuditResult;
  useAppStore.getState().updateTab(activeTabIndex, { audit });
}
