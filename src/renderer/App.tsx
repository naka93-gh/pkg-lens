/**
 * ルートコンポーネント
 * タブが 0 個ならウェルカム画面、1 個以上ならタブバー + サブナビ + メインエリアを表示する
 */

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import AuditPage from "@/components/audit/AuditPage";
import ProjectTabBar from "@/components/layout/ProjectTabBar";
import SubNav from "@/components/layout/SubNav";
import LicensePage from "@/components/licenses/LicensePage";
import PackageListPage from "@/components/packages/PackageListPage";
import SettingsPage from "@/components/settings/SettingsPage";
import TreePage from "@/components/tree/TreePage";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomePage from "@/components/WelcomePage";
import type { ViewType } from "@/store";
import { useAppStore } from "@/store";
import { selectAndOpenProject } from "@/svc/project.svc";

function App(): React.JSX.Element {
  const [active, setActive] = useState(true);
  const tabs = useAppStore((s) => s.tabs);
  const activeView = useAppStore((s) => s.activeView);
  const theme = useAppStore((s) => s.theme);
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

  // テーマに応じて <html> に light クラスをトグル
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

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
        <Toaster
          theme={theme}
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--card-foreground)",
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
    case "licenses":
      return <LicensePage />;
    case "settings":
      return <SettingsPage />;
  }
}

export default App;
