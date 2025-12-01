"use client";

import { useState, useRef, useEffect } from "react";
import { SchemaNode, JsonValue } from "@/lib/jsonParser";
import { ChevronRight, ChevronDown, Box, Hash, Type, List, ToggleLeft, Plus, Trash2 } from "lucide-react";

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
    switch (node.type) {
      case "object": return <Box className="h-3 w-3 text-blue-500" />;
      case "array": return <List className="h-3 w-3 text-orange-500" />;
      case "string": return <Type className="h-3 w-3 text-green-500" />;
      case "number": return <Hash className="h-3 w-3 text-purple-500" />;
      case "boolean": return <ToggleLeft className="h-3 w-3 text-yellow-500" />;
      default: return <div className="h-3 w-3 rounded-full bg-zinc-400" />;
    }
  };

  const [isEditingType, setIsEditingType] = useState(false);
  const [customTypeMode, setCustomTypeMode] = useState(false);
  const [typeEditValue, setTypeEditValue] = useState(node.typeOverride || node.type);
  const typeInputRef = useRef<HTMLInputElement>(null);
  const typeSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditingType) {
      if (customTypeMode && typeInputRef.current) {
        typeInputRef.current.focus();
      } else if (!customTypeMode && typeSelectRef.current) {
        typeSelectRef.current.focus();
      }
    }
  }, [isEditingType, customTypeMode]);

  const submitTypeChange = (newType: string) => {
    // Check if it's a type change that should update the value
    if (["string", "number", "boolean", "null", "Date", "any", "undefined", "object", "array"].includes(newType)) {
      let newValue: JsonValue = "";
      if (newType === "number") newValue = 0;
      else if (newType === "boolean") newValue = false;
      else if (newType === "null") newValue = null;
      else if (newType === "Date") newValue = new Date().toISOString();
      else if (newType === "any") newValue = null;
      else if (newType === "undefined") newValue = null;
      else if (newType === "object") newValue = {};
      else if (newType === "array") newValue = [];
      
      onUpdateNodeValue(node.id, newValue);
      
      // For standard JSON primitives (including object/array), we clear override.
      // For Date, any, undefined, we MUST set override because inferred type won't match.
      if (["string", "number", "boolean", "null", "object", "array"].includes(newType)) {
        onTypeOverride(node.id, "");
      } else {
        onTypeOverride(node.id, newType);
      }
    } else {
      // For custom types
      if (newType && newType !== node.type) {
        onTypeOverride(node.id, newType);
      } else if (newType === node.type) {
        onTypeOverride(node.id, "");
      }
    }
    setIsEditingType(false);
    setCustomTypeMode(false);
  };

  const handleTypeSubmit = () => {
    submitTypeChange(typeEditValue);
  };

  const handleTypeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTypeSubmit();
    if (e.key === "Escape") {
      setIsEditingType(false);
      setCustomTypeMode(false);
      setTypeEditValue(node.typeOverride || node.type);
    }
  };

  const commonTypes = ["string", "number", "boolean", "object", "array", "Date", "any", "null", "undefined"];

  return (
    <div className="select-none">
      <div 
        className="group flex items-center gap-1.5 py-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer text-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => { if (!isEditing && !isEditingType && hasChildren) onToggleExpand(node.id); }}
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
            isEditingType ? (
              customTypeMode ? (
                <input
                  ref={typeInputRef}
                  value={typeEditValue}
                  onChange={(e) => setTypeEditValue(e.target.value)}
                  onBlur={handleTypeSubmit}
                  onKeyDown={handleTypeKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  className="h-5 px-1 w-[80px] bg-white dark:bg-zinc-900 border border-purple-500 rounded text-xs focus:outline-none"
                  placeholder="Type..."
                />
              ) : (
                <select
                  ref={typeSelectRef}
                  value={commonTypes.includes(typeEditValue) ? typeEditValue : "custom"}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setCustomTypeMode(true);
                      setTypeEditValue("");
                    } else {
                      setTypeEditValue(e.target.value);
                      // Immediate submit for select
                      submitTypeChange(e.target.value);
                    }
                  }}
                  onBlur={() => setIsEditingType(false)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-5 px-1 bg-white dark:bg-zinc-900 border border-purple-500 rounded text-xs focus:outline-none"
                >
                  {commonTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  <option value="custom">Custom...</option>
                </select>
              )
            ) : (
              <span 
                className={`
                  px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors
                  ${node.typeOverride 
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40" 
                    : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingType(true);
                  setTypeEditValue(node.typeOverride || node.type);
                }}
                title="Click to change type"
              >
                {node.typeOverride || node.type}
              </span>
            )
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
