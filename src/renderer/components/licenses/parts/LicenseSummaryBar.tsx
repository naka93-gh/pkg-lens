/**
 * ライセンス種別ごとの件数バッジ
 * 上位 6 種を表示し、残りは「その他」にまとめる
 */

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { LicenseEntry } from "@/types";

interface LicenseSummaryBarProps {
  licenses: LicenseEntry[];
}

/**
 * ライセンス種別ごとの件数を集計し、上位を返す
 */
function buildSummary(licenses: LicenseEntry[]): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const l of licenses) {
    counts.set(l.license, (counts.get(l.license) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const MAX = 6;
  const top = sorted.slice(0, MAX).map(([label, count]) => ({ label, count }));

  if (sorted.length > MAX) {
    const otherCount = sorted.slice(MAX).reduce((sum, [, c]) => sum + c, 0);
    top.push({ label: "その他", count: otherCount });
  }

  return top;
}

function LicenseSummaryBar({ licenses }: LicenseSummaryBarProps): React.JSX.Element {
  const summary = useMemo(() => buildSummary(licenses), [licenses]);

  return (
    <div className="flex items-center gap-4">
      {summary.map(({ label, count }) => (
        <span key={label} className={cn("flex items-center gap-1.5 text-xs font-medium")}>
          <span className="inline-block size-2 rounded-full bg-primary" />
          {label}
          <span className="tabular-nums text-muted-foreground">{count}</span>
        </span>
      ))}
    </div>
  );
}

export default LicenseSummaryBar;
export { buildSummary };
