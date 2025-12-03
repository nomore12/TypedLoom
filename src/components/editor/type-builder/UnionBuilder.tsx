import { useState } from "react";
import { Button } from "@/components/common/Button";
import { X } from "lucide-react";

interface UnionBuilderProps {
  initialType: string;
  onApply: (type: string) => void;
}

export function UnionBuilder({ initialType, onApply }: UnionBuilderProps) {
  const commonTypes = ["string", "number", "boolean", "null", "undefined", "Date", "any"];

  const [types, setTypes] = useState<string[]>(() => {
    if (initialType && initialType.includes("|")) {
      return initialType.split("|").map(t => t.trim()).filter(t => !t.startsWith('"'));
    } else if (commonTypes.includes(initialType)) {
      return [initialType];
    }
    return [];
  });



  const addType = (type: string) => {
    if (!types.includes(type)) {
      setTypes([...types, type]);
    }
  };

  const removeType = (type: string) => {
    setTypes(types.filter(t => t !== type));
  };

  const handleApply = () => {
    onApply(types.join(" | "));
  };

  return (
    <div className="p-3">
      <div className="flex flex-wrap gap-2 mb-4">
        {types.map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
            {t}
            <button onClick={() => removeType(t)} className="hover:text-blue-900 dark:hover:text-blue-100">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {types.length === 0 && <span className="text-xs text-zinc-400">No types selected</span>}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {commonTypes.map(t => (
          <button
            key={t}
            onClick={() => addType(t)}
            disabled={types.includes(t)}
            className={`px-2 py-1 text-xs rounded border ${
              types.includes(t)
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Button className="w-full" variant="primary" onClick={handleApply} disabled={types.length === 0}>
        Apply Union Type
      </Button>
    </div>
  );
}
