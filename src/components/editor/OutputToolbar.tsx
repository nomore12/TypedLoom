import { Dispatch, SetStateAction } from "react";

interface OutputToolbarProps {
  tsType: "interface" | "type";
  setTsType: Dispatch<SetStateAction<"interface" | "type">>;
  separateNested: boolean;
  setSeparateNested: Dispatch<SetStateAction<boolean>>;
  toCamelCase: boolean;
  setToCamelCase: Dispatch<SetStateAction<boolean>>;
}

export function OutputToolbar({
  tsType,
  setTsType,
  separateNested,
  setSeparateNested,
  toCamelCase,
  setToCamelCase,
}: OutputToolbarProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto">
      <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded p-0.5 shrink-0">
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

      <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />

      <button
        onClick={() => setSeparateNested(!separateNested)}
        className={`px-3 py-1 text-xs font-medium rounded-sm transition-all border shrink-0 ${
          separateNested
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-300"
        }`}
      >
        Separate Nested
      </button>

      <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />

      <button
        onClick={() => setToCamelCase(!toCamelCase)}
        className={`px-3 py-1 text-xs font-medium rounded-sm transition-all border shrink-0 ${
          toCamelCase
            ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
            : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-300"
        }`}
        title="Convert snake_case to camelCase and generate mapper"
      >
        Snake to Camel
      </button>
    </div>
  );
}
