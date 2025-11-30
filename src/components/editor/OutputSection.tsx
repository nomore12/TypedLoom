"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useMemo, useState } from "react";
import { Tabs } from "@/components/common/Tabs";
import { SchemaNode } from "@/lib/jsonParser";
import { generateZodSchema, generateReactQueryHook, generateReactHookForm, generateTypeScript } from "@/lib/generators";

type OutputTab = "typescript" | "zod" | "query" | "form";

interface OutputSectionProps {
  tsOutput: string;
  isConverting: boolean;
  rootNode?: SchemaNode | null;
}

export function OutputSection({ tsOutput, rootNode }: OutputSectionProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>("typescript");

  const tabs: { value: OutputTab; label: string }[] = [
    { value: "typescript", label: "TypeScript" },
    { value: "zod", label: "Zod" },
    { value: "query", label: "Query" },
    { value: "form", label: "Form" },
  ];

  const generatedCode = useMemo(() => {
    if (!rootNode) return { typescript: "", zod: "", query: "", form: "" };
    return {
      typescript: generateTypeScript(rootNode),
      zod: `import { z } from "zod";\n\nexport const rootSchema = ${generateZodSchema(rootNode)};`,
      query: generateReactQueryHook("Root"),
      form: generateReactHookForm("Root"),
    };
  }, [rootNode]);

  const tabContent: Record<OutputTab, string> = {
    typescript: generatedCode.typescript || tsOutput || `// Waiting for input...`,
    zod: generatedCode.zod || `// Waiting for input...`,
    query: generatedCode.query || `// Waiting for input...`,
    form: generatedCode.form || `// Waiting for input...`,
  };

  return (
    <section className="flex flex-1 min-w-[300px] flex-col overflow-hidden bg-white dark:bg-black">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4"
      />
      <div className="flex-1 overflow-hidden relative">
        <CodeMirror
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
      </div>
    </section>
  );
}
