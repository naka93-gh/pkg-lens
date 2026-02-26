/**
 * 依存ツリーの 1 ノード
 * 展開/折りたたみ + 子ノード遅延レンダリング
 */

import { useTreeSearch } from "@/components/tree/parts/TreeSearchContext";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types";
import { ChevronDown, ChevronRight, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  parentId: string;
}

/**
 * ノードのユニーク ID（パス表現）
 */
export function nodeId(node: TreeNode, parentId: string): string {
  return parentId ? `${parentId}>${node.name}@${node.version}` : `${node.name}@${node.version}`;
}

function TreeNodeItem({ node, depth, parentId }: TreeNodeItemProps): React.JSX.Element {
  // --- データ取得 ---
  const { highlightedIds, expandedIds, scrollTargetId } = useTreeSearch();

  // --- ローカル状態 ---
  const hasChildren = node.children.length > 0;
  const [manualOpen, setManualOpen] = useState(depth === 0 && hasChildren);
  const ref = useRef<HTMLDivElement>(null);

  // --- データ加工 ---
  const myId = nodeId(node, parentId);
  const highlighted = highlightedIds.has(myId);
  const isOpen = expandedIds.has(myId) || manualOpen;

  // --- 副作用 ---
  useEffect(() => {
    if (scrollTargetId === myId && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [scrollTargetId, myId]);

  // --- イベントハンドラ ---
  const toggle = (): void => {
    if (hasChildren) setManualOpen((prev) => !prev);
  };

  // --- 描画 ---
  return (
    <div>
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 py-0.5 cursor-pointer rounded-sm hover:bg-accent/30 transition-colors",
          highlighted && "bg-blue-500/20",
        )}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={toggle}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <Minus className="size-3.5 shrink-0 text-muted-foreground/50" />
        )}

        <span className="font-mono text-sm" style={{ color: "#a9b1d6" }}>
          {node.name}
        </span>

        <span className="font-mono text-xs" style={{ color: "#565f89" }}>
          @{node.version}
        </span>
      </div>

      {isOpen &&
        hasChildren &&
        node.children.map((child, i) => (
          <TreeNodeItem
            key={`${child.name}-${i}`}
            node={child}
            depth={depth + 1}
            parentId={myId}
          />
        ))}
    </div>
  );
}

export default TreeNodeItem;
