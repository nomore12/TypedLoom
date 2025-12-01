"use client";

import { CodeEditor } from "@/components/common/CodeEditor";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useMemo, useState } from "react";
import { Tabs } from "@/components/common/Tabs";
import { SchemaNode } from "@/lib/jsonParser";
import { generateZodSchema, generateReactQueryHook, generateReactHookForm, generateTypeScript } from "@/lib/generators";
import { Copy, Check } from "lucide-react";

type OutputTab = "typescript" | "zod" | "query" | "form";

interface OutputSectionProps {
  tsOutput: string;
  rootNode?: SchemaNode | null;
}

export function OutputSection({ tsOutput, rootNode }: OutputSectionProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>("typescript");
  const [isCopied, setIsCopied] = useState(false);
  const [tsType, setTsType] = useState<"interface" | "type">("interface");
  const [separateNested, setSeparateNested] = useState(true);

  const tabs: { value: OutputTab; label: string }[] = [
    { value: "typescript", label: "TypeScript" },
    { value: "query", label: "Query" },
    { value: "form", label: "Form" },
    { value: "zod", label: "Zod" },
  ];

  const generatedCode = useMemo(() => {
    if (!rootNode) return { typescript: "", zod: "", query: "", form: "" };
    return {
      typescript: generateTypeScript(rootNode, "Root", tsType, separateNested),
      zod: `import { z } from "zod";\n\nexport const rootSchema = ${generateZodSchema(rootNode)};`,
      query: generateReactQueryHook("Root"),
      form: generateReactHookForm(rootNode, "Root"),
    };
  }, [rootNode, tsType, separateNested]);

  const tabContent: Record<OutputTab, string> = {
    typescript: generatedCode.typescript || tsOutput || `// Waiting for input...`,
    zod: generatedCode.zod || `// Waiting for input...`,
    query: generatedCode.query || `// Waiting for input...`,
    form: generatedCode.form || `// Waiting for input...`,
  };

  const handleCopy = async () => {
    const content = tabContent[activeTab];
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="flex flex-1 min-w-[300px] flex-col overflow-hidden bg-white dark:bg-black">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4"
      />
      
      {activeTab === "typescript" && (
        <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded p-0.5">
            <button
              onClick={() => setTsType("interface")}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-all ${
                tsType === "interface"
                  ? "bg-white dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              Interface
            </button>
            <button
              onClick={() => setTsType("type")}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-all ${
                tsType === "type"
                  ? "bg-white dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              Type
            </button>
          </div>
          
          <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
          
          <button
            onClick={() => setSeparateNested(!separateNested)}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-all border ${
              separateNested
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            Separate Nested
          </button>
        </div>
      )}
      <div className="flex-1 overflow-hidden relative group">
        <CodeEditor
          value={tabContent[activeTab]}
          height="100%"
          extensions={[javascript({ typescript: true })]}
          theme={vscodeDark}
          editable={false}
          className="h-full text-sm"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: true,
            indentOnInput: false,
          }}
        />
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white rounded-md transition-all backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Copy to clipboard"
        >
          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </section>
  );
}
