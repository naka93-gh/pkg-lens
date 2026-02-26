/**
 * ツリー画面のツールバー
 * 検索バー + 表示切替 + マッチ件数
 */

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TreeDisplayMode = "direct" | "full";

interface TreeToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  matchCount: number | null;
  displayMode: TreeDisplayMode;
  onDisplayModeChange: (mode: TreeDisplayMode) => void;
}

function TreeToolbar({
  searchValue,
  onSearchChange,
  matchCount,
  displayMode,
  onDisplayModeChange,
}: TreeToolbarProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3">
      {/* 検索バー */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="パッケージを検索..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-7 text-xs"
        />
      </div>

      {/* 表示切替 */}
      <ToggleGroup
        type="single"
        value={displayMode}
        onValueChange={(v) => {
          if (v) onDisplayModeChange(v as TreeDisplayMode);
        }}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="full" className="text-xs h-7 px-2">
          全展開
        </ToggleGroupItem>
        <ToggleGroupItem value="direct" className="text-xs h-7 px-2">
          直接依存のみ
        </ToggleGroupItem>
      </ToggleGroup>

      {/* マッチ件数 */}
      {matchCount !== null && (
        <span className="text-xs text-muted-foreground">
          {matchCount > 0 ? `${matchCount} 件一致` : "一致するパッケージがありません"}
        </span>
      )}
    </div>
  );
}

export default TreeToolbar;
