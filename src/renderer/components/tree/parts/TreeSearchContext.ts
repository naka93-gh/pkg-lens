/**
 * ツリー検索状態の Context
 * TreePage が提供し、TreeNodeItem が消費する
 */

import { createContext, useContext } from "react";

interface TreeSearchState {
  highlightedIds: Set<string>;
  expandedIds: Set<string>;
  scrollTargetId: string | null;
}

const defaultState: TreeSearchState = {
  highlightedIds: new Set(),
  expandedIds: new Set(),
  scrollTargetId: null,
};

export const TreeSearchContext = createContext<TreeSearchState>(defaultState);

export function useTreeSearch(): TreeSearchState {
  return useContext(TreeSearchContext);
}
