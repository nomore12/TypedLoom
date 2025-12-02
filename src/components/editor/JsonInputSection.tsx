import { CodeEditor } from "@/components/common/CodeEditor";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Button } from "@/components/common/Button";
import { EditorView } from "@codemirror/view";
import { jsonrepair } from "jsonrepair";
import { Copy, FileJson, AlertCircle, Check } from "lucide-react";
import { useState } from "react";

interface JsonInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function JsonInputSection({ value, onChange, error }: JsonInputSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleFormat = () => {
    try {
      // Try to repair JSON first
      const repaired = jsonrepair(value);
      const parsed = JSON.parse(repaired);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch {
      // If repair fails, fall back to standard parse to show error
      try {
        const parsed = JSON.parse(value);
        const formatted = JSON.stringify(parsed, null, 2);
        onChange(formatted);
      } catch {
        // Error is already handled by parent, but we can't format
      }
    }
  };

  return (
    <section className="flex flex-1 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
          <FileJson className="h-4 w-4" />
          JSON Input
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onChange("")}>Clear</Button>
          <Button size="sm" variant="ghost" onClick={handleFormat}>Format</Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => {
              navigator.clipboard.writeText(value);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <CodeEditor
          value={value}
          height="100%"
          extensions={[json(), EditorView.lineWrapping]}
          onChange={onChange}
          theme={vscodeDark}
          className="text-sm h-full"
        />
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded text-xs flex items-start gap-2 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <pre className="whitespace-pre-wrap font-mono">{error}</pre>
          </div>
        )}
      </div>
    </section>
  );
}
