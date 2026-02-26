import { Package, ShieldCheck, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

function App(): React.JSX.Element {
  return (
    <TooltipProvider>
      <div className="flex h-full flex-col items-center justify-center gap-6">
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
    </TooltipProvider>
  );
}

export default App;
