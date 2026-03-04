/**
 * 設定画面
 * テーマ切り替えなどアプリ全体の設定を管理する
 */

import { Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppStore } from "@/store";

function SettingsPage(): React.JSX.Element {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <h2 className="text-lg font-semibold">Settings</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Theme</label>
        <ToggleGroup
          type="single"
          variant="outline"
          value={theme}
          onValueChange={(v) => {
            if (v === "light" || v === "dark") setTheme(v);
          }}
        >
          <ToggleGroupItem value="light" className="gap-1.5">
            <Sun className="size-4" />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="gap-1.5">
            <Moon className="size-4" />
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

export default SettingsPage;
