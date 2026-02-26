/**
 * Audit 画面
 * サマリバッジ + フィルタ + 脆弱性テーブル + 空状態/ローディング
 */

import { Loader2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import AuditFilter from "@/components/AuditFilter";
import AuditSummaryBar from "@/components/AuditSummaryBar";
import AuditTable from "@/components/AuditTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { refreshAudit } from "@/svc/audit.svc";
import type { Severity } from "@/types";

const defaultFilter: Severity[] = ["critical", "high", "moderate"];

function AuditPage(): React.JSX.Element {
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const audit = tab?.audit;
  const [filter, setFilter] = useState<Severity[]>(defaultFilter);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (!audit) return [];
    return audit.advisories.filter((a) => filter.includes(a.severity));
  }, [audit, filter]);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await refreshAudit();
    } finally {
      setRefreshing(false);
    }
  };

  // 未取得（ローディング中）
  if (!audit) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          Audit 情報を取得中...
        </div>
      </div>
    );
  }

  const totalVulns = audit.advisories.length;

  return (
    <div className="flex flex-col gap-3">
      {/* サマリバッジ + 再取得ボタン */}
      <div className="flex items-center justify-between">
        <AuditSummaryBar vulnerabilities={audit.metadata.vulnerabilities} />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          disabled={refreshing}
          onClick={handleRefresh}
        >
          {refreshing ? <Loader2 className="size-3.5 animate-spin" /> : "再取得"}
        </Button>
      </div>

      {/* 脆弱性 0 件 */}
      {totalVulns === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
          <ShieldCheck className="size-10 text-tn-success" />
          <p className="text-sm">脆弱性は見つかりませんでした</p>
        </div>
      ) : (
        <>
          {/* フィルタ */}
          <AuditFilter selected={filter} onChange={setFilter} />

          {/* フィルタ全 OFF */}
          {filter.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
              フィルタを選択してください
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
              該当する脆弱性はありません
            </div>
          ) : (
            <AuditTable
              advisories={filtered}
              installedVersions={tab.data?.installedVersions ?? {}}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AuditPage;
