/**
 * パッケージセクション（dependencies / devDependencies / peerDependencies）
 * Collapsible で折りたたみ可能。検索中は強制展開する
 */

import PackageRow from "@/components/packages/parts/PackageRow";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { DepType } from "@/types";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface PackageSectionProps {
  depType: DepType;
}

function PackageSection({ depType }: PackageSectionProps): React.JSX.Element | null {
  // --- データ取得 ---
  const packages = useAppStore((s) => s.tabs[s.activeTabIndex]?.data?.[depType] ?? {});
  const searchQuery = useAppStore((s) => s.searchQuery);

  // --- ローカル状態 ---
  const [open, setOpen] = useState(true);

  // --- フィルタリング ---
  const isSearching = searchQuery.length > 0;
  const query = searchQuery.toLowerCase();
  const names = Object.keys(packages).sort();
  const filtered = isSearching ? names.filter((n) => n.toLowerCase().includes(query)) : names;

  if (filtered.length === 0) return null;

  const isOpen = isSearching || open;

  // --- 描画 ---
  return (
    <Collapsible open={isOpen} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className={cn("size-3.5 transition-transform", isOpen && "rotate-90")} />
        {depType}
        <span className="ml-1 font-normal text-muted-foreground/60">({filtered.length})</span>
      </CollapsibleTrigger>
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
