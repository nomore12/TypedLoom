"use client";

import { useState, useMemo } from "react";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { JsonInputSection } from "@/components/editor/JsonInputSection";
import { TreeViewSection } from "@/components/editor/TreeViewSection";
import { OutputSection } from "@/components/editor/OutputSection";
import { EditorFooter } from "@/components/editor/EditorFooter";
import { jsonToTs } from "@/lib/converter";
import { parseJsonToSchema, applyModifications, SchemaModifications } from "@/lib/jsonParser";

export default function EditorPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [tsOutput, setTsOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [modifications, setModifications] = useState<SchemaModifications>({});

  // Derived state for Tree View and Generators
  const rootNode = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const schema = parseJsonToSchema(parsed);
      return applyModifications(schema, modifications);
    } catch {
      return null;
    }
  }, [jsonInput, modifications]);

  const handleToggleOptional = (id: string) => {
    setModifications(prev => {
      const current = prev[id] || {};
      const isCurrentlyOptional = current.isOptional === true;
      return {
        ...prev,
        [id]: { ...current, isOptional: !isCurrentlyOptional }
      };
    });
  };

  const handleRename = (id: string, newName: string) => {
    setModifications(prev => ({
      ...prev,
      [id]: { ...prev[id], renamedKey: newName }
    }));
  };

  const handleJsonChange = async (json: string) => {
    setJsonInput(json);
    
    // Debounce conversion
    const timer = setTimeout(async () => {
      if (!json.trim()) {
        setTsOutput("");
        return;
      }

      try {
        setIsConverting(true);
        // Basic validation
        JSON.parse(json); 
        const ts = await jsonToTs(json, "Root");
        setTsOutput(ts);
      } catch {
        // Ignore parse errors during typing
      } finally {
        setIsConverting(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <EditorHeader />
      
      {/* Main Content - 3 Column Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: JSON Input */}
        <JsonInputSection 
          value={jsonInput} 
          onChange={handleJsonChange} 
        />

        {/* Middle: Interactive Tree View */}
        <TreeViewSection 
          rootNode={rootNode}
          onToggleOptional={handleToggleOptional}
          onRename={handleRename}
        />

        {/* Right: Output (TypeScript, Zod, etc.) */}
        <OutputSection 
          tsOutput={tsOutput} 
          isConverting={isConverting} 
          rootNode={rootNode}
        />
      </main>

      <EditorFooter />
    </div>
  );
}
