import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Button } from "@/components/common/Button";

interface JsonInputSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function JsonInputSection({ value, onChange }: JsonInputSectionProps) {
  return (
    <section className="flex w-1/3 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">JSON Input</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="xs">Format</Button>
          <Button variant="ghost" size="xs">Paste</Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[json()]}
          theme={vscodeDark}
          onChange={(val) => onChange(val)}
          className="h-full text-sm"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
          }}
        />
      </div>
    </section>
  );
}
