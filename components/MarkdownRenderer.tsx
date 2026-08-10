"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        // Make external links open in new tab
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
        // Collapsible code blocks via a copy button
        pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
      }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    // Extract text from the <code> child
    const el = (children as React.ReactElement)?.props?.children;
    const text = typeof el === "string" ? el : "";
    if (text) {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <div className="code-wrapper">
      <button className="code-copy" onClick={copy} aria-label="复制代码">
        {copied ? "✓ 已复制" : "复制"}
      </button>
      <pre>{children}</pre>
    </div>
  );
}
