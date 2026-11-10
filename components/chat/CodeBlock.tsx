import React, { useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value?: string;
  children?: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, children }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      const codeText = (value && value.trim()) ? value : (codeRef.current?.innerText ?? '');
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const displayLang = (language || 'code').toUpperCase();

  return (
    <div className="relative my-4 border border-velora-border rounded-md overflow-hidden bg-[#0E1013]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#13151A] border-b border-velora-border text-[11px] font-mono text-velora-textMuted select-none">
        <span className="text-velora-copper font-medium tracking-wider">{displayLang}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] hover:text-velora-text transition-colors px-1.5 py-0.5 rounded-sm hover:bg-white/[0.06]"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div ref={codeRef} className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-[#EDEDED]">
        {children ? (
          <pre className="!bg-transparent !p-0 !m-0 !border-none">
            {children}
          </pre>
        ) : (
          <pre className="!bg-transparent !p-0 !m-0 !border-none">
            <code>{value}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
