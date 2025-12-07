import { MessageSquare, Heart } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function EditorFooter() {
  return (
    <footer className="h-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center px-4 justify-between text-xs text-zinc-500 overflow-hidden">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 font-medium">
          © 2025 TypedLoom
        </span>
        <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
        <a
          href="https://github.com/nomore12/TypedLoom"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
        >
          <GitHubIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <a
          href="https://github.com/nomore12/TypedLoom/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Feedback</span>
        </a>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:flex items-center gap-1 text-zinc-400">
          Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" />
        </span>
        <span className="font-mono text-[10px] text-zinc-400 border px-1.5 py-0.5 rounded border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          v0.1.0
        </span>
      </div>
    </footer>
  );
}
