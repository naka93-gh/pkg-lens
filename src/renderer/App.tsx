/**
 * ルートコンポーネント
 * タブが 0 個ならウェルカム画面、1 個以上ならタブバー + サブナビ + メインエリアを表示する
 */

import AuditPage from "@/components/AuditPage";
import PackageListPage from "@/components/PackageListPage";
import ProjectTabBar from "@/components/ProjectTabBar";
import SubNav from "@/components/SubNav";
import TreePage from "@/components/TreePage";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomePage from "@/components/WelcomePage";
import { useAppStore } from "@/store";
import type { ViewType } from "@/store";
import { selectAndOpenProject } from "@/svc/project.svc";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

function App(): React.JSX.Element {
  const [active, setActive] = useState(true);
  const tabs = useAppStore((s) => s.tabs);
  const activeView = useAppStore((s) => s.activeView);
  const hasTabs = tabs.length > 0;

  // ウィンドウフォーカス状態を追跡し、非アクティブ時に CSS で減光する
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

  // Cmd+O / Ctrl+O でプロジェクトを開く
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === "o") {
        e.preventDefault();
        void selectAndOpenProject();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <TooltipProvider>
      <div className={active ? "" : "app-inactive"}>
        <div className="app-container flex h-screen flex-col layer-main">
          {hasTabs ? (
            <>
              <ProjectTabBar />
              <SubNav />
              <main className="flex-1 overflow-auto p-4">
                <MainContent activeView={activeView} />
              </main>
            </>
          ) : (
            <>
              {/* タブバー: ウェルカム時も [+] ボタンを表示 */}
              <ProjectTabBar />
              <WelcomePage />
            </>
          )}
        </div>
        {/* sonner のデフォルトスタイルは白背景なので上書き */}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "oklch(0.25 0.025 264)",
              border: "1px solid oklch(0.36 0.03 260)",
              color: "oklch(0.82 0.03 256)",
            },
          }}
        />
      </div>
    </TooltipProvider>
  );
}

/**
 * activeView に応じてメインコンテンツを切り替える
 */
function MainContent({ activeView }: { activeView: ViewType }): React.JSX.Element {
  switch (activeView) {
    case "packages":
      return <PackageListPage />;
    case "tree":
      return <TreePage />;
    case "audit":
      return <AuditPage />;
    case "settings":
      return (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          TODO: {activeView}
        </div>
      );
  }
}

export default App;
