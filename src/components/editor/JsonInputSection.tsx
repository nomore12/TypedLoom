import { Button } from "@/components/common/Button";

export function JsonInputSection() {
  return (
    <section className="flex w-1/3 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
        <span className="text-sm font-semibold text-zinc-500">JSON Input</span>
        <div className="flex gap-2">
          <Button>Format</Button>
          <Button>Paste</Button>
        </div>
      </div>
      <div className="flex-1 p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="h-full w-full rounded border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
          JSON Editor Placeholder
        </div>
      </div>
    </section>
  );
}
