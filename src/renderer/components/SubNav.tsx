import { Package, ShieldAlert, GitBranch, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAppStore, type ViewType } from "@/store";
import { cn } from "@/lib/utils";

const navItems: { view: ViewType; icon: typeof Package; label: string }[] = [
  { view: "packages", icon: Package, label: "パッケージ一覧" },
  { view: "audit", icon: ShieldAlert, label: "Audit" },
  { view: "tree", icon: GitBranch, label: "依存ツリー" },
  { view: "settings", icon: Settings, label: "設定" },
];

function SubNav(): React.JSX.Element {
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);

  return (
    <div className="layer-subnav flex h-7 shrink-0 items-center gap-1 border-b border-border px-3">
      {navItems.map(({ view, icon: Icon, label }) => {
        const isActive = view === activeView;
        return (
          <Tooltip key={view}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setActiveView(view)}
                className={cn(
                  "flex size-5 items-center justify-center rounded transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" strokeWidth={isActive ? 2.5 : 2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default SubNav;
