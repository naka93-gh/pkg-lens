/**
 * サブナビゲーション
 * メインコンテンツ領域のビュー（パッケージ一覧・Audit・依存ツリー・設定）を切り替える
 */

import { GitBranch, Package, Scale, Settings, ShieldAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppStore, type ViewType } from "@/store";

// アイコンのみ表示し、ラベルはツールチップで補足する
const topItems: { view: ViewType; icon: typeof Package; label: string }[] = [
  { view: "packages", icon: Package, label: "パッケージ一覧" },
  { view: "audit", icon: ShieldAlert, label: "Audit" },
  { view: "tree", icon: GitBranch, label: "依存ツリー" },
  { view: "licenses", icon: Scale, label: "ライセンス" },
];

const settingsItem = { view: "settings" as ViewType, icon: Settings, label: "設定" };

function NavButton({
  view,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  view: ViewType;
  icon: typeof Package;
  label: string;
  isActive: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "flex size-8 items-center justify-center rounded transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SubNav(): React.JSX.Element {
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);

  return (
    <div className="layer-subnav flex w-10 shrink-0 flex-col items-center border-r border-border pt-2">
      <div className="flex flex-col gap-1">
        {topItems.map(({ view, icon, label }) => (
          <NavButton
            key={view}
            view={view}
            icon={icon}
            label={label}
            isActive={view === activeView}
            onClick={() => setActiveView(view)}
          />
        ))}
      </div>
      <div className="mt-auto pb-2">
        <NavButton
          view={settingsItem.view}
          icon={settingsItem.icon}
          label={settingsItem.label}
          isActive={settingsItem.view === activeView}
          onClick={() => setActiveView(settingsItem.view)}
        />
      </div>
    </div>
  );
}

export default SubNav;
