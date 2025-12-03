import { useState } from "react";
import { UnionBuilder } from "./UnionBuilder";
import { LiteralBuilder } from "./LiteralBuilder";

interface TypeSelectorProps {
  initialType: string;
  onApply: (type: string) => void;
  onClose: () => void;
}

type BuilderMode = "basic" | "union" | "literal";

export function TypeSelector({ initialType, onApply, onClose }: TypeSelectorProps) {
  const [mode, setMode] = useState<BuilderMode>(() => {
    if (initialType.includes("|")) {
      if (initialType.includes('"')) return "literal";
      return "union";
    }
    return "basic";
  });

  const handleApply = (type: string) => {
    onApply(type);
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setMode("basic")}
          className={`flex-1 py-2 text-xs font-medium ${
            mode === "basic"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Basic
        </button>
        <button
          onClick={() => setMode("union")}
          className={`flex-1 py-2 text-xs font-medium ${
            mode === "union"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Union
        </button>
        <button
          onClick={() => setMode("literal")}
          className={`flex-1 py-2 text-xs font-medium ${
            mode === "literal"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Literal
        </button>
      </div>

      <div className="flex-1">
        {mode === "basic" && (
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {["string", "number", "boolean", "object", "array", "Date", "any", "null", "undefined"].map(t => (
                <button
                  key={t}
                  onClick={() => handleApply(t)}
                  className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                    initialType === t
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === "union" && (
          <UnionBuilder key={initialType} initialType={initialType} onApply={handleApply} />
        )}
        {mode === "literal" && (
          <LiteralBuilder key={initialType} initialType={initialType} onApply={handleApply} />
        )}
      </div>
    </div>
  );
}
