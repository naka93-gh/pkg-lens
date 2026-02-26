import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { selectAndOpenProject } from "@/svc/project.svc";

function WelcomePage(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-3">
        <Package className="size-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">pkg-lens</h1>
      </div>

      <Button
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
        onClick={() => void selectAndOpenProject()}
      >
        プロジェクトを開く
      </Button>

      <p className="text-xs text-muted-foreground">
        <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
          ⌘O
        </kbd>
        {" "}でも開けます
      </p>
    </div>
  );
}

export default WelcomePage;
