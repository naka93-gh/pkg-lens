/**
 * 深刻度別件数のサマリバッジ
 * ドット + ラベル + 件数を横並びで表示する。件数 0 はグレー、1 以上は対応カラー
 */

import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

interface AuditSummaryBarProps {
  vulnerabilities: Record<Severity, number>;
}

const severityConfig: { key: Severity; label: string; colorClass: string }[] = [
  { key: "critical", label: "Critical", colorClass: "text-tn-danger" },
  { key: "high", label: "High", colorClass: "text-tn-orange" },
  { key: "moderate", label: "Moderate", colorClass: "text-tn-warning" },
  { key: "low", label: "Low", colorClass: "text-tn-success" },
  { key: "info", label: "Info", colorClass: "text-muted-foreground" },
];

const dotColorClass: Record<Severity, string> = {
  critical: "bg-tn-danger",
  high: "bg-tn-orange",
  moderate: "bg-tn-warning",
  low: "bg-tn-success",
  info: "bg-muted-foreground",
};

function AuditSummaryBar({ vulnerabilities }: AuditSummaryBarProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-4">
      {severityConfig.map(({ key, label, colorClass }) => {
        const count = vulnerabilities[key] ?? 0;
        const inactive = count === 0;
        return (
          <span
            key={key}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              inactive ? "text-muted-foreground" : colorClass,
            )}
          >
            <span
              className={cn(
                "inline-block size-2 rounded-full",
                inactive ? "bg-muted-foreground/40" : dotColorClass[key],
              )}
            />
            {label}
            <span className="tabular-nums">{count}</span>
          </span>
        );
      })}
    </div>
  );
}

export default AuditSummaryBar;
export { severityConfig };
