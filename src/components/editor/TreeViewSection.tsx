import { Button } from "@/components/common/Button";

export function TreeViewSection() {
  return (
    <section className="flex w-1/3 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm font-semibold text-zinc-500">
          Interactive Tree
        </span>
        <div className="flex gap-2">
          <Button>Expand All</Button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {/* Mock Tree Items */}
          <div className="flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <span className="text-zinc-400">▼</span>
            <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
              root
            </span>
          </div>
          <div className="pl-6 flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <input
              type="checkbox"
              checked
              className="rounded border-zinc-300"
              readOnly
            />
            <span className="font-mono text-sm">user</span>
            <Button
              variant="ghost"
              className="ml-auto px-1.5 py-0.5"
            >
              Aa
            </Button>
          </div>
          <div className="pl-12 flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <input
              type="checkbox"
              checked
              className="rounded border-zinc-300"
              readOnly
            />
            <span className="font-mono text-sm">id</span>
            <span className="text-xs text-zinc-400 ml-2">number</span>
            <Button
              variant="ghost"
              className="ml-auto px-1.5 py-0.5"
            >
              Aa
            </Button>
          </div>
          <div className="pl-12 flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 opacity-60">
            <input
              type="checkbox"
              className="rounded border-zinc-300"
              readOnly
            />
            <span className="font-mono text-sm line-through decoration-zinc-400">
              deleted_at
            </span>
            <span className="text-xs text-zinc-400 ml-2">string?</span>
            <Button
              variant="ghost"
              className="ml-auto px-1.5 py-0.5"
            >
              Aa
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
