"use client";

import dynamic from 'next/dynamic';
import { EditorView } from '@codemirror/view';
import { Extension, EditorState, Transaction } from '@codemirror/state';

const DynamicCodeMirror = dynamic(
  () => import('@uiw/react-codemirror'),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
  }
);



interface CodeEditorProps extends React.ComponentProps<typeof DynamicCodeMirror> {
  readOnly?: boolean;
  languageExtension?: Extension;
}

export const CodeEditor = ({ readOnly = false, languageExtension, ...props }: CodeEditorProps) => {
  const extensions = [
    languageExtension,
    EditorView.lineWrapping,
    EditorView.editable.of(!readOnly),
    EditorState.readOnly.of(readOnly),
    EditorState.transactionFilter.of((tr) => {
      // Only block changes caused by user events (paste, input, delete, etc.)
      if (readOnly && tr.docChanged && tr.annotation(Transaction.userEvent)) {
        return [];
      }
      return tr;
    }),
  ].filter(Boolean) as Extension[];

  return <DynamicCodeMirror extensions={extensions} readOnly={readOnly} {...props} />;
};
