/**
 * プロジェクトタブバー
 * フラットタブの表示・切替・閉じるボタン・[+] による新規追加を担当する
 * macOS ではタイトルバーを兼ねるためドラッグ領域として機能する
 */

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { closeProject, selectAndOpenProject, switchTab } from "@/svc/project.svc";
import { Loader2, Plus, X } from "lucide-react";

function ProjectTabBar(): React.JSX.Element {
  // --- データ取得 ---
  const tabs = useAppStore((s) => s.tabs);
  const activeTabIndex = useAppStore((s) => s.activeTabIndex);

  // --- 描画 ---
  return (
    // タブバー全体を macOS のドラッグ領域にし、子要素の操作部分は no-drag で除外する
    <div className="titlebar-drag layer-tabbar flex h-9 shrink-0 items-end border-b border-border">
      {/* macOS のトラフィックライト（● ○ ○）と被らないようにスペースを確保 */}
      <div className="w-20 shrink-0" />

      {/* タブ一覧 */}
      <div className="flex min-w-0 flex-1 items-end gap-0">
        {tabs.map((tab, index) => {
          const isActive = index === activeTabIndex;
          // 読み込み完了前は package.json の name がないのでディレクトリ名で代替
          const name = tab.data?.name ?? tab.dir.split("/").pop() ?? "untitled";

          return (
            <button
              key={tab.dir}
              type="button"
              onClick={() => switchTab(index)}
              className={cn(
                "titlebar-no-drag group relative flex h-8 max-w-48 items-center gap-1.5 px-3 text-xs transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* ローディング / dirty マーク */}
              {tab.loading ? (
                <Loader2 className="size-3 animate-spin text-muted-foreground" />
              ) : (
                tab.dirty && <span className="text-[10px] text-tn-warning">●</span>
              )}

              {/* タブ名 */}
              <span className="truncate font-mono">{name}</span>

              {/* 閉じるボタン（ホバー時のみ表示、普段は非表示でスッキリ見せる） */}
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  // タブ切替が発火しないようにバブリングを止める
                  e.stopPropagation();
                  closeProject(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    closeProject(index);
                  }
                }}
                className="ml-0.5 hidden rounded p-0.5 hover:bg-secondary group-hover:inline-flex"
              >
                <X className="size-3" />
              </span>

              {/* アクティブ下線 */}
              {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
            </button>
          );
        })}
      </div>

      {/* [+] ボタン */}
      <button
        type="button"
        onClick={() => void selectAndOpenProject()}
        className="titlebar-no-drag mx-2 flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export default ProjectTabBar;
