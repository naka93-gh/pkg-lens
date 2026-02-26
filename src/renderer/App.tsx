import { useEffect, useState } from "react";
import { Package, ShieldCheck, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

function App(): React.JSX.Element {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onFocus = (): void => setActive(true);
    const onBlur = (): void => setActive(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <TooltipProvider>
      <div className={active ? "" : "app-inactive"}>
        <div className="app-container flex h-screen flex-col layer-main">
          {/* macOS ドラッグ領域（タイトルバー代替） */}
          <div className="titlebar-drag h-9 shrink-0" />
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-bold text-primary">pkg-lens</h1>
            <p className="text-muted-foreground">npm パッケージ管理ツール</p>

            <div className="flex gap-3">
              <Button variant="default">
                <Package className="size-4" />
                パッケージ
              </Button>
              <Button variant="secondary">
                <ShieldCheck className="size-4" />
                Audit
              </Button>
              <Button variant="outline">
                <GitBranch className="size-4" />
                依存ツリー
              </Button>
            </div>

            <div className="flex gap-4 text-sm">
              <span className="text-tn-success">success</span>
              <span className="text-tn-warning">warning</span>
              <span className="text-tn-danger">danger</span>
              <span className="text-tn-info">info</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
