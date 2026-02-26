/**
 * パッケージ検索バー
 * 200ms デバウンスで store の searchQuery を更新する
 */

import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { Search } from "lucide-react";
import { useCallback, useRef } from "react";

function SearchBar(): React.JSX.Element {
  // --- データ取得 ---
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  // --- ローカル状態 ---
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- イベントハンドラ ---
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSearchQuery(value), 200);
    },
    [setSearchQuery],
  );

  // --- 描画 ---
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="パッケージを検索..."
        onChange={handleChange}
        className="h-7 pl-8 text-xs"
      />
    </div>
  );
}

export default SearchBar;
