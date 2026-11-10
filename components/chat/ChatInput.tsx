import React, { useRef, useEffect } from 'react';
import { ArrowUp, BookMarked, GitBranch, X } from 'lucide-react';
import { Button } from '../ui/button';
import { AVAILABLE_MODELS } from '@/lib/puter/ai';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  activeModel: string;
  onOpenVault: () => void;
  branchingFromNodeId?: string | null;
  onCancelBranching?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  activeModel,
  onOpenVault,
  branchingFromNodeId,
  onCancelBranching,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    }
  };

  const modelObj = AVAILABLE_MODELS.find((m) => m.id === activeModel) || AVAILABLE_MODELS[0];

  return (
    <div className="relative max-w-3xl mx-auto w-full px-4 md:px-0 pb-4">
      {/* Branching Banner if branching from an earlier turn */}
      {branchingFromNodeId && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-editorial-charcoal text-editorial-bronzeLight border border-editorial-borderDark text-xs font-mono rounded-sm animate-in fade-in-0 duration-150">
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-editorial-bronze" />
            <span>Forking new analytical branch from turn #{branchingFromNodeId.slice(-4)}</span>
          </div>
          {onCancelBranching && (
            <button
              onClick={onCancelBranching}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px]"
            >
              <X className="w-3 h-3" />
              <span>Cancel Fork</span>
            </button>
          )}
        </div>
      )}

      {/* Input Container */}
      <div className="relative flex flex-col bg-card border border-border focus-within:border-foreground/50 transition-colors shadow-sm rounded-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Frame an inquiry, propose a thesis, or command an editorial audit..."
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 outline-none font-sans"
        />

        {/* Input Footer Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/40 text-xs select-none">
          <div className="flex items-center gap-2">
            {/* Active Model Indicator */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] text-muted-foreground bg-muted/60 border border-border/60 rounded-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none inline-block" />
              {modelObj.name}
            </span>

            {/* Prompt Vault Trigger */}
            <button
              type="button"
              onClick={onOpenVault}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-transparent hover:border-border/60 rounded-sm"
              title="Open Prompt Vault templates"
            >
              <BookMarked className="w-3.5 h-3.5 text-editorial-bronze" />
              <span>Prompt Vault</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] font-mono text-muted-foreground/60">
              Return ↵ to dispatch
            </span>

            <Button
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !input.trim()}
              size="icon"
              variant="primary"
              className="h-7 w-7 rounded-sm"
              aria-label="Send message"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
