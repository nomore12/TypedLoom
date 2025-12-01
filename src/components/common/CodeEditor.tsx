"use client";

import dynamic from 'next/dynamic';

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror'),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
  }
);

export const CodeEditor = CodeMirror;
