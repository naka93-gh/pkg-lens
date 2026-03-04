/**
 * ライセンステーブル
 * パッケージ名・バージョン・ライセンスの 3 列でソート可能
 */

import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { LicenseEntry } from "@/types";

interface LicenseTableProps {
  entries: LicenseEntry[];
}

type SortKey = "name" | "version" | "license";
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string; className: string }[] = [
  { key: "name", label: "パッケージ名", className: "flex-[2]" },
  { key: "version", label: "バージョン", className: "w-[120px] shrink-0" },
  { key: "license", label: "ライセンス", className: "flex-1" },
];

function compare(a: LicenseEntry, b: LicenseEntry, key: SortKey, dir: SortDir): number {
  const result = a[key].localeCompare(b[key]);
  return dir === "asc" ? result : -result;
}

function LicenseTable({ entries }: LicenseTableProps): React.JSX.Element {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(
    () => [...entries].sort((a, b) => compare(a, b, sortKey, sortDir)),
    [entries, sortKey, sortDir],
  );

  const handleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey],
  );

  return (
    <div className="flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-border">
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
      </div>

      {/* 行 */}
      {sorted.map((entry) => (
        <div
          key={`${entry.name}@${entry.version}`}
          className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent/30 rounded transition-colors"
        >
          <span className="flex-[2] min-w-0 truncate font-mono">{entry.name}</span>
          <span className="w-[120px] shrink-0 font-mono text-muted-foreground">
            {entry.version}
          </span>
          <span
            className={cn(
              "flex-1 min-w-0 truncate",
              entry.license === "UNKNOWN" && "text-tn-warning",
            )}
          >
            {entry.license}
          </span>
        </div>
      ))}
    </div>
  );
}

export default LicenseTable;
