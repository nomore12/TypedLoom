"use client";

import { useState } from "react";
import { Tabs } from "@/components/common/Tabs";

type OutputTab = "typescript" | "zod" | "query" | "form";

export function OutputSection() {
  const [activeTab, setActiveTab] = useState<OutputTab>("typescript");

  const tabs: { value: OutputTab; label: string }[] = [
    { value: "typescript", label: "TypeScript" },
    { value: "query", label: "Query" },
    { value: "form", label: "Form" },
    { value: "zod", label: "Zod" },
  ];

  const tabContent: Record<OutputTab, string> = {
    typescript: `export interface Root {
  user: {
    id: number;
    name?: string;
  }
}`,

    query: `import { useQuery } from "@tanstack/react-query";

export function useRoot() {
  return useQuery({
    queryKey: ["root"],
    queryFn: fetchRoot,
  });
}`,
    form: `import { useForm } from "react-hook-form";

export function useRootForm() {
  return useForm<Root>();
}`,
    zod: `import { z } from "zod";

export const rootSchema = z.object({
  user: z.object({
    id: z.number(),
    name: z.string().optional(),
  }),
});`,
  };

  return (
    <section className="flex w-1/3 min-w-[300px] flex-col bg-zinc-50 dark:bg-zinc-900">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 p-4">
        <div className="h-full w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 font-mono text-sm text-zinc-600 dark:text-zinc-300 shadow-sm overflow-auto">
          <pre>{tabContent[activeTab]}</pre>
        </div>
      </div>
    </section>
  );
}
