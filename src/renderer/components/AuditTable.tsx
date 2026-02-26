/**
 * 脆弱性テーブル
 * ソート（深刻度/パッケージ名/タイトル）+ 行クリックでアコーディオン展開
 */

import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import AuditDetailPanel from "@/components/AuditDetailPanel";
import { cn } from "@/lib/utils";
import type { AuditAdvisory, Severity } from "@/types";

interface AuditTableProps {
  advisories: AuditAdvisory[];
  installedVersions: Record<string, string>;
}

type SortKey = "severity" | "moduleName" | "title";
type SortDir = "asc" | "desc";

const severityOrder: Record<Severity, number> = {
  critical: 0,
  high: 1,
  moderate: 2,
  low: 3,
  info: 4,
};

const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  moderate: "Moderate",
  low: "Low",
  info: "Info",
};

const severityDotClass: Record<Severity, string> = {
  critical: "bg-tn-danger",
  high: "bg-tn-orange",
  moderate: "bg-tn-warning",
  low: "bg-tn-success",
  info: "bg-muted-foreground",
};

const severityTextClass: Record<Severity, string> = {
  critical: "text-tn-danger",
  high: "text-tn-orange",
  moderate: "text-tn-warning",
  low: "text-tn-success",
  info: "text-muted-foreground",
};

const columns: { key: SortKey; label: string; className: string }[] = [
  { key: "severity", label: "深刻度", className: "w-[100px]" },
  { key: "moduleName", label: "パッケージ名", className: "flex-1" },
  { key: "title", label: "タイトル", className: "flex-1" },
];

function compare(a: AuditAdvisory, b: AuditAdvisory, key: SortKey, dir: SortDir): number {
  let result: number;
  if (key === "severity") {
    result = severityOrder[a.severity] - severityOrder[b.severity];
  } else {
    result = a[key].localeCompare(b[key]);
  }
  return dir === "asc" ? result : -result;
}

function AuditTable({ advisories, installedVersions }: AuditTableProps): React.JSX.Element {
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const sorted = useMemo(
    () => [...advisories].sort((a, b) => compare(a, b, sortKey, sortDir)),
    [advisories, sortKey, sortDir],
  );

  const handleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir(key === "severity" ? "asc" : "asc");
      }
    },
    [sortKey],
  );

  const toggleExpand = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-border">
        {/* 展開アイコン分のスペース */}
        <span className="w-4 shrink-0" />
        {columns.map(({ key, label, className }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSort(key)}
            className={cn(
              "flex items-center gap-1 hover:text-foreground transition-colors text-left",
              className,
            )}
          >
            {label}
            {sortKey === key && (
              <span className="text-[10px]">{sortDir === "asc" ? "▲" : "▼"}</span>
            )}
          </button>
        ))}
        <span className="w-[100px] shrink-0">修正 ver</span>
      </div>

      {/* 行 */}
      {sorted.map((adv) => {
        const expanded = expandedIds.has(adv.id);
        return (
          <div key={adv.id}>
            <button
              type="button"
              onClick={() => toggleExpand(adv.id)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent/30 rounded transition-colors text-left"
            >
              <span className="w-4 shrink-0 text-muted-foreground">
                {expanded ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
              </span>

              {/* 深刻度 */}
              <span
                className={cn(
                  "w-[100px] shrink-0 flex items-center gap-1.5",
                  severityTextClass[adv.severity],
                )}
              >
                <span
                  className={cn("inline-block size-2 rounded-full", severityDotClass[adv.severity])}
                />
                {severityLabel[adv.severity]}
              </span>

              {/* パッケージ名 */}
              <span className="flex-1 min-w-0 truncate font-mono">{adv.moduleName}</span>

              {/* タイトル */}
              <span className="flex-1 min-w-0 truncate">{adv.title}</span>

              {/* 修正 ver */}
              <span className="w-[100px] shrink-0 font-mono text-muted-foreground truncate">
                {adv.patchedVersions || "─"}
              </span>
            </button>

            {expanded && (
              <AuditDetailPanel
                advisory={adv}
                installedVersion={installedVersions[adv.moduleName]}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AuditTable;
