/**
 * パッケージセクション（dependencies / devDependencies / peerDependencies）
 * Collapsible で折りたたみ可能。検索中は強制展開する
 */

import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PackageRow from "@/components/PackageRow";
import { cn } from "@/lib/utils";
import type { AuditAdvisory, RegistryPackageMeta } from "@/types";
import { useState } from "react";

export interface PackageSectionProps {
  title: string;
  /** パッケージ名 → 指定バージョンの Map */
  packages: Record<string, string>;
  /** パッケージ名 → インストール済みバージョンの Map */
  installedVersions: Record<string, string>;
  /** パッケージ名 → レジストリメタ情報の Map（null = 未取得） */
  latestVersions: Record<string, RegistryPackageMeta> | null;
  /** audit 脆弱性一覧（null = 未取得） */
  advisories: AuditAdvisory[] | null;
  /** 検索クエリ（空文字 = フィルタなし） */
  searchQuery: string;
}

function PackageSection({
  title,
  packages,
  installedVersions,
  latestVersions,
  advisories,
  searchQuery,
}: PackageSectionProps): React.JSX.Element | null {
  const [open, setOpen] = useState(true);

  const isSearching = searchQuery.length > 0;
  const query = searchQuery.toLowerCase();

  // フィルタ適用
  const names = Object.keys(packages).sort();
  const filtered = isSearching ? names.filter((n) => n.toLowerCase().includes(query)) : names;

  // パッケージが 0 件ならセクションごと非表示
  if (filtered.length === 0) return null;

  // advisory を名前でグルーピング
  const advisoryMap = new Map<string, AuditAdvisory[]>();
  if (advisories) {
    for (const a of advisories) {
      const list = advisoryMap.get(a.moduleName) ?? [];
      list.push(a);
      advisoryMap.set(a.moduleName, list);
    }
  }

  // 検索中は強制展開
  const isOpen = isSearching || open;

  return (
    <Collapsible open={isOpen} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className={cn("size-3.5 transition-transform", isOpen && "rotate-90")} />
        {title}
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
          <PackageRow
            key={name}
            name={name}
            specifiedVersion={packages[name]}
            installedVersion={installedVersions[name]}
            latestVersion={latestVersions?.[name]?.version}
            latestLoaded={latestVersions !== null}
            advisories={advisoryMap.get(name) ?? []}
            auditLoaded={advisories !== null}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default PackageSection;
