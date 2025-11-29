import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600"></div>
          <span className="text-lg font-bold">JSON to TS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex rounded-md bg-zinc-100 dark:bg-zinc-800 p-1">
            <button className="rounded px-3 py-1 text-sm font-medium bg-white dark:bg-zinc-700 shadow-sm">Free</button>
            <button className="rounded px-3 py-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Basic</button>
          </div>
          <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Login</button>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: Source (JSON Editor) */}
        <section className="flex w-1/3 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
            <span className="text-sm font-semibold text-zinc-500">JSON Input</span>
            <div className="flex gap-2">
               <button className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700">Format</button>
               <button className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700">Paste</button>
            </div>
          </div>
          <div className="flex-1 p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
             <div className="h-full w-full rounded border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                JSON Editor Placeholder
             </div>
          </div>
        </section>

        {/* Center: Tweak (Tree View) */}
        <section className="flex w-1/3 min-w-[300px] flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex h-10 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-900">
            <span className="text-sm font-semibold text-zinc-500">Interactive Tree</span>
            <div className="flex gap-2">
               <button className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700">Expand All</button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
             <div className="space-y-2">
                {/* Mock Tree Items */}
                <div className="flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
                   <span className="text-zinc-400">▼</span>
                   <span className="font-mono text-sm text-blue-600 dark:text-blue-400">root</span>
                </div>
                <div className="pl-6 flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
                   <input type="checkbox" checked className="rounded border-zinc-300" readOnly />
                   <span className="font-mono text-sm">user</span>
                   <button className="ml-auto text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">Aa</button>
                </div>
                <div className="pl-12 flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900">
                   <input type="checkbox" checked className="rounded border-zinc-300" readOnly />
                   <span className="font-mono text-sm">id</span>
                   <span className="text-xs text-zinc-400 ml-2">number</span>
                   <button className="ml-auto text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">Aa</button>
                </div>
                <div className="pl-12 flex items-center gap-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 opacity-60">
                   <input type="checkbox" className="rounded border-zinc-300" readOnly />
                   <span className="font-mono text-sm line-through decoration-zinc-400">deleted_at</span>
                   <span className="text-xs text-zinc-400 ml-2">string?</span>
                   <button className="ml-auto text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">Aa</button>
                </div>
             </div>
          </div>
        </section>

        {/* Right: Output (Tabs) */}
        <section className="flex w-1/3 min-w-[300px] flex-col bg-zinc-50 dark:bg-zinc-900">
           <div className="flex h-10 items-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2">
              <button className="h-full px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600 dark:text-blue-400">TypeScript</button>
              <button className="h-full px-4 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">Zod</button>
              <button className="h-full px-4 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">Query</button>
              <button className="h-full px-4 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">Form</button>
           </div>
           <div className="flex-1 p-4">
              <div className="h-full w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 font-mono text-sm text-zinc-600 dark:text-zinc-300 shadow-sm">
                 <pre>{`export interface Root {
  user: {
    id: number;
    name?: string;
  }
}`}</pre>
              </div>
           </div>
        </section>
      </main>

      {/* Footer: History */}
      <footer className="h-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-4 justify-between">
         <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">History</span>
            <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">User API v1</button>
            <button className="text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200">Payment Response</button>
         </div>
         <div className="text-xs text-zinc-400">
            Client-side processing • Secure
         </div>
      </footer>
    </div>
  );
}
