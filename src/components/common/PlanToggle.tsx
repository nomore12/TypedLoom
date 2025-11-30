"use client";

import { useState } from "react";

export function PlanToggle() {
  const [plan, setPlan] = useState<"free" | "basic">("free");

  return (
    <div className="flex rounded-md bg-zinc-100 dark:bg-zinc-800 p-1">
      <button
        onClick={() => setPlan("free")}
        className={`rounded px-3 py-2 text-sm font-medium transition-all ${
          plan === "free"
            ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
      >
        Free
      </button>
      <button
        onClick={() => setPlan("basic")}
        className={`rounded px-3 py-2 text-sm font-medium transition-all ${
          plan === "basic"
            ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
      >
        Basic
      </button>
    </div>
  );
}
