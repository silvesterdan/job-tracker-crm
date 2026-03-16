"use client";

import { useRef } from "react";

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

export function MarkdownEditor({ name, defaultValue, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end);
    const inserted = `${before}${selected || "text"}${after}`;
    el.value = el.value.slice(0, start) + inserted + el.value.slice(end);
    el.focus();
    el.setSelectionRange(start + before.length, start + before.length + (selected || "text").length);
  }

  function insertBullet() {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const lineStart = el.value.lastIndexOf("\n", pos - 1) + 1;
    el.value = el.value.slice(0, lineStart) + "- " + el.value.slice(lineStart);
    el.focus();
    el.setSelectionRange(pos + 2, pos + 2);
  }

  return (
    <div>
      <div className="mb-1 flex gap-1">
        <button
          type="button"
          onClick={() => wrap("**", "**")}
          className="rounded border border-zinc-300 px-2 py-0.5 text-xs font-bold hover:bg-zinc-100"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => wrap("*", "*")}
          className="rounded border border-zinc-300 px-2 py-0.5 text-xs italic hover:bg-zinc-100"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={insertBullet}
          className="rounded border border-zinc-300 px-2 py-0.5 text-xs hover:bg-zinc-100"
          title="Bullet list"
        >
          • List
        </button>
      </div>
      <textarea
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-28 w-full rounded border p-2 font-mono text-sm"
      />
    </div>
  );
}
