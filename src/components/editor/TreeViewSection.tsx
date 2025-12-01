import { useState } from "react";
import { Button } from "@/components/common/Button";
import { SchemaNode } from "@/lib/jsonParser";
import { TreeNode } from "./TreeNode";

interface TreeViewSectionProps {
  rootNode: SchemaNode | null;
  onToggleOptional: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onTypeOverride: (id: string, type: string) => void;
}

const getAllIds = (node: SchemaNode): string[] => {
  let ids = [node.id];
  if (node.children) {
    node.children.forEach(child => {
      ids = ids.concat(getAllIds(child));
    });
  }
  return ids;
};

export function TreeViewSection({ rootNode, onToggleOptional, onRename, onTypeOverride }: TreeViewSectionProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const handleExpandAll = () => {
    setCollapsedIds(new Set());
  };

  const handleCollapseAll = () => {
    if (rootNode) {
      setCollapsedIds(new Set(getAllIds(rootNode)));
    }
  };

  const handleToggleExpand = (id: string) => {
    const newCollapsedIds = new Set(collapsedIds);
    if (newCollapsedIds.has(id)) {
      newCollapsedIds.delete(id);
    } else {
      newCollapsedIds.add(id);
    }
    setCollapsedIds(newCollapsedIds);
  };

  return (
    <section className="flex flex-1 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tree View</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="xs" onClick={handleExpandAll}>Expand All</Button>
          <Button variant="ghost" size="xs" onClick={handleCollapseAll}>Collapse All</Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {rootNode ? (
          <TreeNode 
            node={rootNode} 
            onToggleOptional={onToggleOptional}
            onRename={onRename}
            onTypeOverride={onTypeOverride}
            collapsedIds={collapsedIds}
            onToggleExpand={handleToggleExpand}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Invalid JSON
          </div>
        )}
      </div>
    </section>
  );
}
