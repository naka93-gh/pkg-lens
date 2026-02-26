/**
 * 依存ツリーの 1 ノード
 * 展開/折りたたみ + 子ノード遅延レンダリング
 */

import { ChevronRight, ChevronDown, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TreeNode } from "@/types";
import { cn } from "@/lib/utils";

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  parentId: string;
  highlighted: boolean;
  forceExpanded: boolean;
  highlightedIds: Set<string>;
  expandedIds: Set<string>;
  scrollTargetId: string | null;
}

/** ノードのユニーク ID（パス表現） */
export function nodeId(node: TreeNode, parentId: string): string {
  return parentId ? `${parentId}>${node.name}@${node.version}` : `${node.name}@${node.version}`;
}

function TreeNodeItem({
  node,
  depth,
  parentId,
  highlighted,
  forceExpanded,
  highlightedIds,
  expandedIds,
  scrollTargetId,
}: TreeNodeItemProps): React.JSX.Element {
  const hasChildren = node.children.length > 0;
  const [manualOpen, setManualOpen] = useState(depth === 0 && hasChildren);
  const ref = useRef<HTMLDivElement>(null);

  const myId = nodeId(node, parentId);
  const isOpen = forceExpanded || manualOpen;

  // 最初のマッチノードに scrollIntoView
  useEffect(() => {
    if (scrollTargetId === myId && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [scrollTargetId, myId]);

  const toggle = (): void => {
    if (hasChildren) setManualOpen((prev) => !prev);
  };

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
        node.children.map((child, i) => {
          const childId = nodeId(child, myId);
          return (
            <TreeNodeItem
              key={`${child.name}-${i}`}
              node={child}
              depth={depth + 1}
              parentId={myId}
              highlighted={highlightedIds.has(childId)}
              forceExpanded={expandedIds.has(childId)}
              highlightedIds={highlightedIds}
              expandedIds={expandedIds}
              scrollTargetId={scrollTargetId}
            />
          );
        })}
    </div>
  );
}

export default TreeNodeItem;
