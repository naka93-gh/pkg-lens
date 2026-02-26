import { X, Plus } from "lucide-react";
import { useAppStore } from "@/store";
import { closeProject, switchTab } from "@/svc/project.svc";
import { selectAndOpenProject } from "@/svc/project.svc";
import { cn } from "@/lib/utils";

function ProjectTabBar(): React.JSX.Element {
  const tabs = useAppStore((s) => s.tabs);
  const activeTabIndex = useAppStore((s) => s.activeTabIndex);

  return (
    <div className="titlebar-drag layer-tabbar flex h-9 shrink-0 items-end border-b border-border">
      {/* macOS トラフィックライト分のスペーサー */}
      <div className="w-20 shrink-0" />

      {/* タブ一覧 */}
      <div className="flex min-w-0 flex-1 items-end gap-0">
        {tabs.map((tab, index) => {
          const isActive = index === activeTabIndex;
          const name = tab.data?.name ?? tab.dir.split("/").pop() ?? "untitled";

          return (
            <button
              key={tab.dir}
              type="button"
              onClick={() => switchTab(index)}
              className={cn(
                "titlebar-no-drag group relative flex h-8 max-w-48 items-center gap-1.5 px-3 text-xs transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* dirty マーク */}
              {tab.dirty && (
                <span className="text-tn-warning text-[10px]">●</span>
              )}

              {/* タブ名 */}
              <span className="truncate font-mono">{name}</span>

              {/* 閉じるボタン（ホバー時のみ表示） */}
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
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
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
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
