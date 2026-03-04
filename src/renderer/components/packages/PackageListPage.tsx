/**
 * パッケージ一覧ページ
 * SearchBar + 3 セクション（dependencies / devDependencies / peerDependencies）を表示する
 */

import { Loader2 } from "lucide-react";
import PackageSection from "@/components/packages/parts/PackageSection";
import SearchBar from "@/components/packages/parts/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store";
import type { DepType } from "@/types";

const depTypes: DepType[] = ["dependencies", "devDependencies", "peerDependencies"];

function PackageListPage(): React.JSX.Element {
  // --- データ取得 ---
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);

  // --- 描画 ---
  if (!tab?.data) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        {depTypes.map((dt) => (
          <div key={dt} className="flex flex-col gap-1 px-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
        <div className="flex items-center justify-center h-20 text-sm text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          パッケージ情報を取得中...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <SearchBar />
      {depTypes.map((depType) => (
        <PackageSection key={depType} depType={depType} />
      ))}
    </div>
  );
}

export default PackageListPage;
