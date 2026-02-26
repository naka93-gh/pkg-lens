/**
 * パッケージ検索バー
 * 200ms デバウンスで store の searchQuery を更新する
 */

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { useRef, useCallback } from "react";

function SearchBar(): React.JSX.Element {
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSearchQuery(value), 200);
    },
    [setSearchQuery],
  );

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
