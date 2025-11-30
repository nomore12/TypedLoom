"use client";

import { useMemo, useState, useEffect } from "react";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { JsonInputSection } from "@/components/editor/JsonInputSection";
import { TreeViewSection } from "@/components/editor/TreeViewSection";
import { OutputSection } from "@/components/editor/OutputSection";
import { EditorFooter } from "@/components/editor/EditorFooter";
import { jsonToTs } from "@/lib/converter";
import { parseJsonToSchema, applyModifications, SchemaModifications } from "@/lib/jsonParser";

const DEFAULT_JSON = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "settings": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": false
      }
    }
  }
}`;

export default function EditorPage() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [tsOutput, setTsOutput] = useState("");
  const [modifications, setModifications] = useState<SchemaModifications>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedJson = localStorage.getItem("typedloom_json");
    const savedMods = localStorage.getItem("typedloom_mods");

    if (savedJson && savedJson !== DEFAULT_JSON) {
      // eslint-disable-next-line
      setJsonInput(savedJson);
    }

    if (savedMods && savedMods !== "{}") {
      try {
        const parsedMods = JSON.parse(savedMods);
        setModifications(parsedMods);
      } catch {
        // Ignore error
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("typedloom_json", jsonInput);
    }
  }, [jsonInput, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("typedloom_mods", JSON.stringify(modifications));
    }
  }, [modifications, isLoaded]);

  // Derived state for Tree View and Generators
  const rootNode = useMemo(() => {
    try {
      if (!jsonInput.trim()) return null;
      const parsed = JSON.parse(jsonInput);
      const rawNode = parseJsonToSchema(parsed);
      return applyModifications(rawNode, modifications);
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

  const handleTypeOverride = (id: string, type: string) => {
    setModifications(prev => ({
      ...prev,
      [id]: { ...prev[id], typeOverride: type }
    }));
  };

  const handleJsonChange = async (json: string) => {
    setJsonInput(json);
    setJsonError(null); // Reset error on change
    
    // Debounce conversion
    const timer = setTimeout(async () => {
      if (!json.trim()) {
        setTsOutput("");
        setJsonError(null);
        return;
      }

      try {
        // Basic validation
        JSON.parse(json); 
        const ts = await jsonToTs(json, "Root");
        setTsOutput(ts);
        setJsonError(null);
      } catch (e) {
        if (e instanceof Error) {
          setJsonError(e.message);
        } else {
          setJsonError("Invalid JSON format");
        }
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
          error={jsonError}
        />

        {/* Middle: Interactive Tree View */}
        <TreeViewSection 
          rootNode={rootNode}
          onToggleOptional={handleToggleOptional}
          onRename={handleRename}
          onTypeOverride={handleTypeOverride}
        />

        {/* Right: Output (TypeScript, Zod, etc.) */}
        <OutputSection 
          tsOutput={tsOutput} 
          rootNode={rootNode}
        />
      </main>

      <EditorFooter />
    </div>
  );
}
