import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 lg:px-12 border-b border-zinc-100 dark:border-zinc-900/50 backdrop-blur-sm sticky top-0 z-50 bg-white/80 dark:bg-black/80">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">TypedLoom</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
          <a href="https://github.com/nomore12/TypedLoom" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
            Login
          </Link>
          <Link
            href="/editor"
            className="rounded-full bg-zinc-900 dark:bg-white px-5 py-2 text-sm font-semibold text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
          >
            Open Editor
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent opacity-60 blur-3xl rounded-full pointer-events-none" />
          </div>
          
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              v1.0 Public Beta is live
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
              Weave JSON into <br className="hidden md:block" />
              <span className="text-blue-600 dark:text-blue-400">Type-Safe Code</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Stop manually writing interfaces. TypedLoom instantly converts your JSON into TypeScript, Zod schemas, and TanStack Query hooks with a powerful interactive editor.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/editor"
                className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
              >
                Start Weaving Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link
                href="#demo"
                className="h-12 px-8 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-2 transition-all"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Interactive Tweak",
                  desc: "Don't just convert. Fine-tune your types with our tree-view editor. Toggle optionals and rename fields instantly.",
                  icon: "✨"
                },
                {
                  title: "Client-Side Secure",
                  desc: "Your data never leaves your browser. We process everything locally for maximum security and zero latency.",
                  icon: "🔒"
                },
                {
                  title: "Full Stack Ready",
                  desc: "Generate Zod schemas, TanStack Query hooks, and React Hook Form boilerplate in one click.",
                  icon: "⚡"
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-colors group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">TypedLoom</span>
          </div>
          <p className="text-sm text-zinc-500">
            © 2025 TypedLoom. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
