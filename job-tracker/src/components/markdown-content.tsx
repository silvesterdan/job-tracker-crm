"use client";

import ReactMarkdown from "react-markdown";

export function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
        li: ({ children }) => <li className="mb-0.5">{children}</li>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
