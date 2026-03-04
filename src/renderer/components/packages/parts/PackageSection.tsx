/**
 * パッケージセクション（dependencies / devDependencies / peerDependencies）
 * Collapsible で折りたたみ可能。検索中は強制展開する
 */

import { ArrowUpCircle, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import PackageRow from "@/components/packages/parts/PackageRow";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getOutdatedLevel } from "@/lib/version";
import { cn } from "@/lib/utils";
import { batchUpdate } from "@/svc/package.svc";
import { useAppStore } from "@/store";
import type { DepType } from "@/types";

interface PackageSectionProps {
  depType: DepType;
}

function PackageSection({ depType }: PackageSectionProps): React.JSX.Element | null {
  // --- データ取得 ---
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const packages = tab?.data?.[depType] ?? {};
  const installedVersions = tab?.data?.installedVersions ?? {};
  const latestVersions = tab?.latestVersions;
  const searchQuery = useAppStore((s) => s.searchQuery);

  // --- ローカル状態 ---
  const [open, setOpen] = useState(true);

  // --- フィルタリング ---
  const isSearching = searchQuery.length > 0;
  const query = searchQuery.toLowerCase();
  const names = Object.keys(packages).sort();
  const filtered = isSearching ? names.filter((n) => n.toLowerCase().includes(query)) : names;

  // --- outdated 件数 ---
  const outdatedCount = useMemo(() => {
    if (!latestVersions) return 0;
    return names.filter((name) => {
      const latest = latestVersions[name]?.version;
      if (!latest) return false;
      const installed = installedVersions[name] ?? packages[name];
      return getOutdatedLevel(installed, latest) !== "upToDate";
    }).length;
  }, [names, latestVersions, installedVersions, packages]);

  if (filtered.length === 0) return null;

  const isOpen = isSearching || open;

  const handleBatchUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const count = batchUpdate(depType);
    if (count > 0) {
      toast.success(`${count} 件を更新しました`);
    }
  };

  // --- 描画 ---
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen}>
      <div className="flex w-full items-center">
        <CollapsibleTrigger className="flex flex-1 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className={cn("size-3.5 transition-transform", isOpen && "rotate-90")} />
          {depType}
          <span className="ml-1 font-normal text-muted-foreground/60">({filtered.length})</span>
        </CollapsibleTrigger>
        {outdatedCount > 0 && (
          <button
            type="button"
            onClick={handleBatchUpdate}
            className="mr-3 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowUpCircle className="size-3" />
            全て更新
          </button>
        )}
      </div>
      <CollapsibleContent>
        {/* ヘッダー行 */}
        <div className="flex items-center gap-2 px-3 py-1 text-[10px] text-muted-foreground/60 uppercase tracking-wider">
          <span className="w-[40%]">パッケージ</span>
          <span className="w-[15%]">指定バージョン</span>
          <span className="w-[15%]">インストール済み</span>
          <span className="w-[15%]">最新</span>
          <span className="w-[15%]">Audit</span>
        </div>
        {filtered.map((name) => (
          <PackageRow key={name} name={name} depType={depType} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default PackageSection;
