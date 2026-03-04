/**
 * ツリーコンテナ
 * ルートノードを並べて TreeNodeItem を描画する
 */

import TreeNodeItem, { nodeId } from "@/components/tree/parts/TreeNodeItem";
import type { TreeNode } from "@/types";

interface TreeViewProps {
  nodes: TreeNode[];
}

function TreeView({ nodes }: TreeViewProps): React.JSX.Element {
  return (
    <div className="flex flex-col">
      {nodes.map((node) => (
        <TreeNodeItem key={nodeId(node, "")} node={node} depth={0} parentId="" />
      ))}
    </div>
  );
}

export default TreeView;
