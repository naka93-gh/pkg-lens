import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/store";
import ProjectTabBar from "@/components/ProjectTabBar";
import SubNav from "@/components/SubNav";
import WelcomePage from "@/components/WelcomePage";

function App(): React.JSX.Element {
  const [active, setActive] = useState(true);
  const tabs = useAppStore((s) => s.tabs);
  const hasTabs = tabs.length > 0;

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
          {hasTabs ? (
            <>
              <ProjectTabBar />
              <SubNav />
              <main className="flex-1 overflow-auto p-4">
                {/* フェーズ 2 でコンテンツを実装 */}
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
      </div>
    </TooltipProvider>
  );
}

export default App;
