import { CodeEditor } from "@/components/common/CodeEditor";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Button } from "@/components/common/Button";
import { EditorView } from "@codemirror/view";

interface JsonInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function JsonInputSection({ value, onChange, error }: JsonInputSectionProps) {
  return (
    <section className="flex flex-1 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">JSON Input</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onChange("")}>Clear</Button>
          <Button size="sm" variant="ghost" onClick={() => {
            try {
              const formatted = JSON.stringify(JSON.parse(value), null, 2);
              onChange(formatted);
            } catch {
              // Ignore error
            }
          }}>Format</Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <CodeEditor
          value={value}
          height="100%"
          extensions={[json(), EditorView.lineWrapping]}
          onChange={onChange}
          theme={vscodeDark}
          className="h-full text-sm"
          placeholder="// Paste your JSON here..."
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: true,
            indentOnInput: false,
          }}
        />
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded text-xs backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
