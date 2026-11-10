import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const displayLang = (language || 'code').toUpperCase();

  return (
    <div className="relative my-4 border border-editorial-borderDark rounded-sm overflow-hidden bg-editorial-obsidian">
      <div className="flex items-center justify-between px-3 py-1.5 bg-editorial-charcoal/80 border-b border-editorial-borderDark text-[11px] font-mono text-muted-foreground select-none">
        <span className="text-editorial-bronze font-medium tracking-wider">{displayLang}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] hover:text-foreground transition-colors px-1.5 py-0.5 rounded-sm hover:bg-muted/30"
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

      <div className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-[#EDEDED]">
        <pre className="!bg-transparent !p-0 !m-0 !border-none">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};

