/**
 * ツリーコンテナ
 * ルートノードを並べて TreeNodeItem を描画する
 */

import TreeNodeItem from "@/components/tree/parts/TreeNodeItem";
import type { TreeNode } from "@/types";

interface TreeViewProps {
  nodes: TreeNode[];
}

function TreeView({ nodes }: TreeViewProps): React.JSX.Element {
  return (
    <div className="flex flex-col">
      {nodes.map((node, i) => (
        <TreeNodeItem
          key={`${node.name}-${i}`}
          node={node}
          depth={0}
          parentId=""
        />
      ))}
    </div>
  );
}

export default TreeView;
