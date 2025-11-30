"use client";

import { useState, useRef, useEffect } from "react";
import { SchemaNode } from "@/lib/jsonParser";
import { ChevronRight, ChevronDown, Box, Hash, Type, List, ToggleLeft } from "lucide-react";

interface TreeNodeProps {
  node: SchemaNode;
  level?: number;
  onToggleOptional: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export function TreeNode({ node, level = 0, onToggleOptional, onRename }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.key);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const hasChildren = node.children && node.children.length > 0;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleRenameSubmit = () => {
    if (editValue.trim() && editValue !== node.key) {
      onRename(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") {
      setEditValue(node.key);
      setIsEditing(false);
    }
  };

  const getIcon = () => {
    switch (node.type) {
      case "object": return <Box className="h-3 w-3 text-blue-500" />;
      case "array": return <List className="h-3 w-3 text-orange-500" />;
      case "string": return <Type className="h-3 w-3 text-green-500" />;
      case "number": return <Hash className="h-3 w-3 text-purple-500" />;
      case "boolean": return <ToggleLeft className="h-3 w-3 text-yellow-500" />;
      default: return <div className="h-3 w-3 rounded-full bg-zinc-400" />;
    }
  };

  return (
    <div className="select-none">
      <div 
        className="group flex items-center gap-1.5 py-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer text-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => { if (!isEditing) setIsExpanded(!isExpanded); }}
      >
        <span 
          className="flex items-center justify-center w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          onClick={hasChildren ? toggleExpand : undefined}
        >
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          )}
        </span>
        
        {/* Optional Toggle - Hide for root (level 0) */}
        {level > 0 && (
          <input
            type="checkbox"
            checked={!node.isOptional}
            onChange={(e) => {
              e.stopPropagation();
              onToggleOptional(node.id);
            }}
            className="h-3 w-3 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            title="Toggle Optional/Required"
          />
        )}

        {getIcon()}
        
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="h-5 px-1 min-w-[60px] max-w-[150px] bg-white dark:bg-zinc-900 border border-blue-500 rounded text-xs focus:outline-none"
          />
        ) : (
          <span 
            className={`font-medium ${node.originalKey ? "text-blue-600 dark:text-blue-400" : "text-zinc-700 dark:text-zinc-300"}`}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            title="Double click to rename"
          >
            {node.key}
            {node.isOptional && <span className="text-zinc-400 ml-0.5">?</span>}
          </span>
        )}
        
        <span className="text-xs text-zinc-400 ml-1">
          {node.type}
        </span>

        {node.value !== undefined && (
          <span className="text-xs text-zinc-500 dark:text-zinc-500 ml-2 truncate max-w-[100px]">
            {String(node.value)}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              onToggleOptional={onToggleOptional}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
}
