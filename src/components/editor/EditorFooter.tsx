export function EditorFooter() {
  return (
    <footer className="h-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-4 justify-between">
      <div className="flex items-center gap-4 overflow-x-auto">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          History
        </span>
        <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          User API v1
        </button>
        <button className="text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200">
          Payment Response
        </button>
      </div>
      <div className="text-xs text-zinc-400">
        Client-side processing • Secure
      </div>
    </footer>
  );
}
