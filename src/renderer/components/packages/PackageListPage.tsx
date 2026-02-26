/**
 * パッケージ一覧ページ
 * SearchBar + 3 セクション（dependencies / devDependencies / peerDependencies）を表示する
 */

import PackageSection from "@/components/packages/parts/PackageSection";
import SearchBar from "@/components/packages/parts/SearchBar";
import { useAppStore } from "@/store";
import type { DepType } from "@/types";

const depTypes: DepType[] = ["dependencies", "devDependencies", "peerDependencies"];

function PackageListPage(): React.JSX.Element {
  // --- データ取得 ---
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);

  // --- 描画 ---
  if (!tab?.data) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        読み込み中...
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
