import Link from "next/link";
import { PlanToggle } from "@/components/common/PlanToggle";
import { Button } from "../common/Button";
import { Logo } from "@/components/common/Logo";

export function EditorHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">TypedLoom</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {/* <PlanToggle /> */}
        {/* <Button variant="outline" size="md">Login</Button>
        <Button variant="outline" size="md">Sign Up</Button> */}
      </div>
    </header>
  );
}
