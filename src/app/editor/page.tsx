import { EditorHeader } from "@/components/editor/EditorHeader";
import { JsonInputSection } from "@/components/editor/JsonInputSection";
import { TreeViewSection } from "@/components/editor/TreeViewSection";
import { OutputSection } from "@/components/editor/OutputSection";
import { EditorFooter } from "@/components/editor/EditorFooter";

export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans">
      <EditorHeader />

      {/* Main Content - 3 Column Layout */}
      <main className="flex flex-1 overflow-hidden">
        <JsonInputSection />
        <TreeViewSection />
        <OutputSection />
      </main>

      <EditorFooter />
    </div>
  );
}
