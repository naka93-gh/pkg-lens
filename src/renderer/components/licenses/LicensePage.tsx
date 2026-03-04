/**
 * ライセンス一覧画面
 * サマリバッジ + フィルタ + テーブル
 */

import { Scale } from "lucide-react";
import { useMemo, useState } from "react";
import LicenseFilter from "@/components/licenses/parts/LicenseFilter";
import LicenseSummaryBar, { buildSummary } from "@/components/licenses/parts/LicenseSummaryBar";
import LicenseTable from "@/components/licenses/parts/LicenseTable";
import { useAppStore } from "@/store";

function LicensePage(): React.JSX.Element {
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const licenses = tab?.data?.licenses ?? [];

  // フィルタの初期値: 上位種別をすべて選択
  const allLabels = useMemo(() => buildSummary(licenses).map((s) => s.label), [licenses]);
  const [filter, setFilter] = useState<string[]>(() => allLabels);

  // フィルタ適用
  const filtered = useMemo(() => {
    if (filter.length === 0) return [];
    // 「その他」に含まれるライセンス種別を算出
    const topLabels = new Set(allLabels.filter((l) => l !== "その他"));
    return licenses.filter((l) => {
      if (filter.includes(l.license)) return true;
      if (filter.includes("その他") && !topLabels.has(l.license)) return true;
      return false;
    });
  }, [licenses, filter, allLabels]);

  // データなし
  if (licenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
        <Scale className="size-10" />
        <p className="text-sm">ライセンス情報がありません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* サマリ */}
      <LicenseSummaryBar licenses={licenses} />

      {/* フィルタ */}
      <LicenseFilter licenses={licenses} selected={filter} onChange={setFilter} />

      {/* テーブル */}
      {filter.length === 0 ? (
        <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
          フィルタを選択してください
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
          該当するパッケージはありません
        </div>
      ) : (
        <LicenseTable entries={filtered} />
      )}
    </div>
  );
}

export default LicensePage;
