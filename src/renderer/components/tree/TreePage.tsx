/**
 * 依存ツリー画面
 * ツールバー + ツリー + 空状態ハンドリング
 */

import { Package } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { TreeSearchContext } from "@/components/tree/parts/TreeSearchContext";
import { nodeId } from "@/components/tree/parts/TreeNodeItem";
import TreeToolbar, { type TreeDisplayMode } from "@/components/tree/parts/TreeToolbar";
import TreeView from "@/components/tree/parts/TreeView";
import { useAppStore } from "@/store";
import type { TreeNode } from "@/types";
import { useDebounce } from "@/lib/useDebounce";

// TODO: tree/parts/ にヘルパーとして切り出す
/**
 * ツリーを再帰探索し、名前が query に部分一致するノードのパスを収集する
 * 戻り値: { matched: マッチノード ID, ancestors: 展開すべき祖先 ID }
 */
function findMatches(
  nodes: TreeNode[],
  query: string,
): { matched: Set<string>; ancestors: Set<string> } {
  const matched = new Set<string>();
  const ancestors = new Set<string>();
  const lowerQuery = query.toLowerCase();

  function walk(node: TreeNode, parentId: string, isRoot: boolean): boolean {
    const id = nodeId(node, parentId);
    let hasMatchBelow = false;

    for (const child of node.children) {
      if (walk(child, id, false)) {
        hasMatchBelow = true;
      }
    }

    if (node.name.toLowerCase().includes(lowerQuery)) {
      matched.add(id);
      hasMatchBelow = true;
    }

    if (hasMatchBelow && !isRoot) {
      ancestors.add(id);
    }

    return hasMatchBelow;
  }

  for (const node of nodes) {
    const id = nodeId(node, "");
    if (walk(node, "", true)) {
      ancestors.add(id);
    }
  }

  return { matched, ancestors };
}

function TreePage(): React.JSX.Element {
  // --- データ取得 ---
  const tab = useAppStore((s) => s.tabs[s.activeTabIndex]);
  const tree = tab?.tree;

  // --- ローカル状態 ---
  const [searchInput, setSearchInput] = useState("");
  const [displayMode, setDisplayMode] = useState<TreeDisplayMode>("full");
  const debouncedQuery = useDebounce(searchInput, 200);
  const isSearching = debouncedQuery.length > 0;

  // --- データ加工 ---
  const displayNodes = useMemo(() => {
    if (!tree) return [];
    if (displayMode === "direct") {
      return tree.map((n) => ({ ...n, children: [] }));
    }
    return tree;
  }, [tree, displayMode]);

  const { matched, ancestors, firstMatchId } = useMemo(() => {
    if (!isSearching || displayNodes.length === 0) {
      return { matched: new Set<string>(), ancestors: new Set<string>(), firstMatchId: null };
    }
    const result = findMatches(displayNodes, debouncedQuery);
    const firstId = result.matched.size > 0 ? [...result.matched][0] : null;
    return { ...result, firstMatchId: firstId };
  }, [displayNodes, debouncedQuery, isSearching]);

  // --- イベントハンドラ ---
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleDisplayModeChange = useCallback((mode: TreeDisplayMode) => {
    setDisplayMode(mode);
  }, []);

  const searchCtx = useMemo(
    () => ({ highlightedIds: matched, expandedIds: ancestors, scrollTargetId: firstMatchId }),
    [matched, ancestors, firstMatchId],
  );

  // --- 描画 ---
  if (tree === null || tree === undefined) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        読み込み中...
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
        <Package className="size-10 opacity-40" />
        <p className="text-sm">依存ツリーを表示できません</p>
        <p className="text-xs opacity-70">npm install を実行してください</p>
      </div>
    );
  }

  return (
    <TreeSearchContext.Provider value={searchCtx}>
      <div className="flex flex-col gap-3">
        <TreeToolbar
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          matchCount={isSearching ? matched.size : null}
          displayMode={displayMode}
          onDisplayModeChange={handleDisplayModeChange}
        />
        <TreeView nodes={displayNodes} />
      </div>
    </TreeSearchContext.Provider>
  );
}

export default TreePage;
