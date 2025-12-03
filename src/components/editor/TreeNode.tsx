"use client";

import { TypeBuilderPopover } from "./type-builder/TypeBuilderPopover";
import { TypeSelector } from "./type-builder/TypeSelector";
import { useState, useRef, useEffect } from "react";
import { SchemaNode, JsonValue } from "@/lib/jsonParser";
import { ChevronRight, ChevronDown, Box, Hash, Type, List, ToggleLeft, Plus, Trash2, Calendar, Asterisk, Ban, CircleOff } from "lucide-react";

export type ExpandAction = {
  type: 'expand' | 'collapse';
  timestamp: number;
};

interface TreeNodeProps {
  node: SchemaNode;
  level?: number;
  onToggleOptional: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onTypeOverride: (id: string, type: string) => void;
  collapsedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onAddNode: (path: string, key: string, value: JsonValue) => void;
  onRemoveNode: (path: string) => void;
  onUpdateNodeValue: (path: string, value: JsonValue) => void;
}

export function TreeNode({ 
  node, 
  level = 0, 
  onToggleOptional, 
  onRename, 
  onTypeOverride, 
  collapsedIds,
  onToggleExpand,
  onAddNode,
  onRemoveNode,
  onUpdateNodeValue
}: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.key);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = !collapsedIds.has(node.id);

  const [showTypeBuilder, setShowTypeBuilder] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const typeBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(node.id);
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

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Generate unique key based on max counter
    const baseKey = "newField";
    let maxCounter = 0;
    let hasBaseKey = false;
    
    if (node.children) {
      node.children.forEach(c => {
        if (c.key === baseKey) {
          hasBaseKey = true;
        } else if (c.key.startsWith(`${baseKey}_`)) {
          const numPart = c.key.substring(baseKey.length + 1);
          const num = parseInt(numPart, 10);
          if (!isNaN(num) && num > maxCounter) {
            maxCounter = num;
          }
        }
      });
    }

    let newKey = baseKey;
    if (hasBaseKey || maxCounter > 0) {
      newKey = `${baseKey}_${maxCounter + 1}`;
    }

    const newValue = "string"; // Default value
    onAddNode(node.id, newKey, newValue);
    
    // Auto expand if collapsed
    if (!isExpanded) {
      onToggleExpand(node.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveNode(node.id);
  };

  const getIcon = () => {
    const effectiveType = node.typeOverride || node.type;
    switch (effectiveType) {
      case "object": return <Box className="h-3 w-3 text-blue-500" />;
      case "array": return <List className="h-3 w-3 text-orange-500" />;
      case "string": return <Type className="h-3 w-3 text-green-500" />;
      case "number": return <Hash className="h-3 w-3 text-purple-500" />;
      case "boolean": return <ToggleLeft className="h-3 w-3 text-yellow-500" />;
      case "Date": return <Calendar className="h-3 w-3 text-pink-500" />;
      case "any": return <Asterisk className="h-3 w-3 text-red-500" />;
      case "null": return <Ban className="h-3 w-3 text-zinc-400" />;
      case "undefined": return <CircleOff className="h-3 w-3 text-zinc-400" />;
      default: return <div className="h-3 w-3 rounded-full bg-zinc-400" />;
    }
  };

  const submitTypeChange = (newType: string) => {
    let newValue: JsonValue | undefined = undefined;

    // Helper to get default value for basic types
    const getBasicDefault = (type: string): JsonValue | undefined => {
      if (type === "string") return "";
      if (type === "number") return 0;
      if (type === "boolean") return false;
      if (type === "null") return null;
      if (type === "Date") return new Date().toISOString();
      if (type === "any") return null;
      if (type === "undefined") return null;
      if (type === "object") return {};
      if (type === "array") return [];
      return undefined;
    };

    // 1. Try basic types
    newValue = getBasicDefault(newType);

    // 2. If not basic, try to parse complex types
    if (newValue === undefined) {
      // Check for String Literal: "value" | ...
      const literalMatch = newType.match(/^"([^"]+)"/);
      if (literalMatch) {
        newValue = literalMatch[1];
      } else {
        // Check for Union: type | ...
        const firstType = newType.split("|")[0].trim();
        
        // Check for Numeric Literal
        if (!isNaN(Number(firstType)) && firstType !== "") {
          newValue = Number(firstType);
        }
        // Check for Boolean Literal
        else if (firstType === "true") {
          newValue = true;
        } else if (firstType === "false") {
          newValue = false;
        }
        // Fallback to basic default
        else {
          newValue = getBasicDefault(firstType);
        }
      }
    }

    // Update value if we found a default
    if (newValue !== undefined) {
      onUpdateNodeValue(node.id, newValue);
    }

    // Update type override
    // Only clear override if it's a standard JSON type that matches the inferred type
    const standardTypes = ["string", "number", "boolean", "null", "undefined", "object", "array"];
    if (standardTypes.includes(newType)) {
      onTypeOverride(node.id, "");
    } else {
      onTypeOverride(node.id, newType);
    }
  };

  const handleTypeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeBadgeRef.current) {
      const rect = typeBadgeRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
      setShowTypeBuilder(true);
    }
  };

  const handleTypeBuilderApply = (newType: string) => {
    submitTypeChange(newType);
    setShowTypeBuilder(false);
  };

  return (
    <div className="select-none">
      <div 
        className="group flex items-center gap-1.5 py-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* ... (Chevron, Checkbox, Icon, Key Edit) ... */}
        
        <span 
          className="flex items-center justify-center w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          onClick={hasChildren ? toggleExpand : undefined}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          ) : (
            <span className="w-3 h-3" />
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
        
        <span className="text-xs text-zinc-400 ml-1 flex items-center gap-1">
          {level > 0 && (
            <div 
              ref={typeBadgeRef}
              className={`
                px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer
                ${node.typeOverride 
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40" 
                  : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300"
                }
              `}
              onClick={handleTypeClick}
              title="Click to change type"
            >
              {node.typeOverride || node.type}
            </div>
          )}
        </span>

        {node.value !== undefined && (
          <span className="text-xs text-zinc-500 dark:text-zinc-500 ml-2 truncate max-w-[100px]">
            {String(node.value)}
          </span>
        )}

        {/* Action Buttons (Add/Remove) - Always Visible for now */}
        <div className="ml-auto flex items-center gap-1">
          {(node.type === "object" || node.type === "array") && (
            <button
              onClick={handleAddChild}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500 hover:text-blue-500"
              title="Add Child"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
          {level > 0 && (
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500 hover:text-red-500"
              title="Remove Node"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Type Builder Popover */}
      <TypeBuilderPopover
        isOpen={showTypeBuilder}
        onClose={() => setShowTypeBuilder(false)}
        position={popoverPosition}
      >
        <TypeSelector
          initialType={node.typeOverride || node.type}
          onApply={handleTypeBuilderApply}
          onClose={() => setShowTypeBuilder(false)}
        />
      </TypeBuilderPopover>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              onToggleOptional={onToggleOptional}
              onRename={onRename}
              onTypeOverride={onTypeOverride}
              collapsedIds={collapsedIds}
              onToggleExpand={onToggleExpand}
              onAddNode={onAddNode}
              onRemoveNode={onRemoveNode}
              onUpdateNodeValue={onUpdateNodeValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}
