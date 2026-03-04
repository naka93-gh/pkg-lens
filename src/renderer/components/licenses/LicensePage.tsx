/**
 * ライセンス一覧画面
 * スコープ切り替え + サマリバッジ + フィルタ + テーブル
 */

import { Scale } from "lucide-react";
import { useMemo, useState } from "react";
import LicenseFilter from "@/components/licenses/parts/LicenseFilter";
import LicenseScopeToggle from "@/components/licenses/parts/LicenseScopeToggle";
import LicenseSummaryBar, { buildSummary } from "@/components/licenses/parts/LicenseSummaryBar";
import LicenseTable from "@/components/licenses/parts/LicenseTable";
import { useAppStore } from "@/store";

export type LicenseScope = "direct" | "all";
export type LicenseDepType = "prod" | "dev" | "peer" | "transitive";

/**
 * テーブルに渡す行データ
 */
export interface LicenseRow {
  name: string;
  version: string;
  license: string;
  depType: LicenseDepType;
}

/**
 * フィルタ + テーブル部分
 * key でスコープ変更時にリマウントし、フィルタ state を確実にリセットする
 */
function LicenseContent({ rows }: { rows: LicenseRow[] }): React.JSX.Element {
  const allLabels = useMemo(() => buildSummary(rows).map((s) => s.label), [rows]);
  const [filter, setFilter] = useState<string[]>(allLabels);

  const filtered = useMemo(() => {
    if (filter.length === 0) return [];
    const topLabels = new Set(allLabels.filter((l) => l !== "その他"));
    return rows.filter((r) => {
      if (filter.includes(r.license)) return true;
      if (filter.includes("その他") && !topLabels.has(r.license)) return true;
      return false;
    });
  }, [rows, filter, allLabels]);

  return (
    <>
      {/* サマリ */}
      <LicenseSummaryBar rows={rows} />

      {/* フィルタ */}
      <LicenseFilter rows={rows} selected={filter} onChange={setFilter} />

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
    </>
  );
}

function LicensePage(): React.JSX.Element {
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const data = tab?.data;
  const allLicenses = data?.licenses ?? [];

  const [scope, setScope] = useState<LicenseScope>("direct");

  // パッケージ名 → 依存種別のマップ
  const depTypeMap = useMemo(() => {
    if (!data) return new Map<string, LicenseDepType>();
    const m = new Map<string, LicenseDepType>();
    for (const name of Object.keys(data.dependencies)) m.set(name, "prod");
    for (const name of Object.keys(data.devDependencies)) m.set(name, "dev");
    for (const name of Object.keys(data.peerDependencies)) m.set(name, "peer");
    return m;
  }, [data]);

  // スコープに応じて行データを構築
  const rows: LicenseRow[] = useMemo(() => {
    const source =
      scope === "all" ? allLicenses : allLicenses.filter((l) => depTypeMap.has(l.name));
    return source.map((l) => ({
      ...l,
      depType: depTypeMap.get(l.name) ?? "transitive",
    }));
  }, [allLicenses, scope, depTypeMap]);

  if (allLicenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
        <Scale className="size-10" />
        <p className="text-sm">ライセンス情報がありません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <LicenseScopeToggle scope={scope} onChange={setScope} />
      <LicenseContent key={scope} rows={rows} />
    </div>
  );
}

export default LicensePage;
