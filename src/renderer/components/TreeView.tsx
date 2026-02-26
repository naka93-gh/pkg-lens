/**
 * ツリーコンテナ
 * ルートノードを並べて TreeNodeItem を描画する
 */

import TreeNodeItem, { nodeId } from "@/components/TreeNodeItem";
import type { TreeNode } from "@/types";

interface TreeViewProps {
  nodes: TreeNode[];
  highlightedIds: Set<string>;
  expandedIds: Set<string>;
  scrollTargetId: string | null;
}

function TreeView({
  nodes,
  highlightedIds,
  expandedIds,
  scrollTargetId,
}: TreeViewProps): React.JSX.Element {
  return (
    <div className="flex flex-col">
      {nodes.map((node, i) => {
        const id = nodeId(node, "");
        return (
          <TreeNodeItem
            key={`${node.name}-${i}`}
            node={node}
            depth={0}
            parentId=""
            highlighted={highlightedIds.has(id)}
            forceExpanded={expandedIds.has(id)}
            highlightedIds={highlightedIds}
            expandedIds={expandedIds}
            scrollTargetId={scrollTargetId}
          />
        );
      })}
    </div>
  );
}

export default TreeView;
