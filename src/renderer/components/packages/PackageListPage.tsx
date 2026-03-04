/**
 * パッケージ一覧ページ
 * SearchBar + 3 セクション（dependencies / devDependencies / peerDependencies）を表示する
 */

import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import PackageSection from "@/components/packages/parts/PackageSection";
import SearchBar from "@/components/packages/parts/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { save } from "@/svc/package.svc";
import { useAppStore } from "@/store";
import type { DepType } from "@/types";

const depTypes: DepType[] = ["dependencies", "devDependencies", "peerDependencies"];

function PackageListPage(): React.JSX.Element {
  // --- データ取得 ---
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const dirty = tab?.dirty ?? false;

  // --- イベントハンドラ ---
  const handleSave = async () => {
    await save();
    toast.success("保存しました");
  };

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
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar />
        </div>
        {dirty && (
          <button
            type="button"
            onClick={() => void handleSave()}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            <Save className="size-3" />
            保存
          </button>
        )}
      </div>
      {depTypes.map((depType) => (
        <PackageSection key={depType} depType={depType} />
      ))}
    </div>
  );
}

export default PackageListPage;
