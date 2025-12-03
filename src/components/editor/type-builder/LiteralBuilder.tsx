import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Plus, X } from "lucide-react";

interface LiteralBuilderProps {
  initialType: string;
  onApply: (type: string) => void;
}

export function LiteralBuilder({ initialType, onApply }: LiteralBuilderProps) {
  const [values, setValues] = useState<string[]>(() => {
    if (initialType) {
      const parts = initialType.split("|").map(t => t.trim());
      const literals = parts
        .filter(t => t.startsWith('"') && t.endsWith('"'))
        .map(t => t.slice(1, -1));
      if (literals.length > 0) return literals;
    }
    return [];
  });
  const [inputValue, setInputValue] = useState("");



  const addValue = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      setValues([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeValue = (val: string) => {
    setValues(values.filter(v => v !== val));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue();
    }
  };

  const handleApply = () => {
    const typeString = values.map(v => `"${v}"`).join(" | ");
    onApply(typeString);
  };

  return (
    <div className="p-3">
      <div className="flex gap-2 mb-3">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter value (e.g. active)"
          className="flex-1 px-2 py-1 text-sm border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
        <Button size="sm" onClick={addValue} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 max-h-[150px] overflow-y-auto">
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
            &quot;{v}&quot;
            <button onClick={() => removeValue(v)} className="hover:text-green-900 dark:hover:text-green-100">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {values.length === 0 && <span className="text-xs text-zinc-400">No values added</span>}
      </div>

      <Button className="w-full" variant="primary" onClick={handleApply} disabled={values.length === 0}>
        Apply Literal Type
      </Button>
    </div>
  );
}
