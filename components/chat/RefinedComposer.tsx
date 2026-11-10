import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, BookMarked, ChevronDown, GitBranch, X } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/lib/puter/ai';

interface RefinedComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  activeModel: string;
  onSelectModel: (modelId: string) => void;
  onOpenVault: () => void;
  branchingFromNodeId?: string | null;
  onCancelBranching?: () => void;
}

export const RefinedComposer: React.FC<RefinedComposerProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  activeModel,
  onSelectModel,
  onOpenVault,
  branchingFromNodeId,
  onCancelBranching,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Auto-resize textarea smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    } else if (e.key === 'Escape' && branchingFromNodeId) {
      onCancelBranching?.();
    }
  };

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === activeModel) || AVAILABLE_MODELS[0];

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 pb-6 pt-2">
      {/* Branching Tag if branching from an earlier turn */}
      {branchingFromNodeId && (
        <div className="flex items-center justify-between px-3 py-1 mb-2 bg-velora-surface border border-velora-copper/30 text-velora-copperLight text-xs font-mono rounded-sm animate-in fade-in-0 duration-150">
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3 h-3 text-velora-copper" />
            <span>Forking from turn #{branchingFromNodeId.slice(-4)}</span>
          </div>
          {onCancelBranching && (
            <button
              onClick={onCancelBranching}
              className="text-velora-textMuted hover:text-velora-text flex items-center gap-1 text-[11px]"
            >
              <X className="w-3 h-3" />
              <span>Cancel (Esc)</span>
            </button>
          )}
        </div>
      )}

      {/* Main Composer Box */}
      <div className="relative flex flex-col bg-velora-surface border border-velora-border hover:border-velora-borderLight focus-within:border-velora-copper/60 rounded-md transition-all shadow-lg">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question, frame a thesis, or analyze a concept..."
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[14.5px] leading-relaxed text-velora-text placeholder:text-velora-textMuted/45 outline-none font-sans"
        />

        {/* Toolbar Bar */}
        <div className="flex items-center justify-between px-3 py-2 text-xs select-none">
          {/* Left: Model Switcher & Vault */}
          <div className="flex items-center gap-1.5">
            {/* Model Switcher Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated rounded-sm transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-velora-copper rounded-full inline-block" />
                <span>{currentModel.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isModelMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsModelMenuOpen(false)} />
                  <div className="absolute left-0 bottom-full mb-1.5 w-60 bg-velora-elevated border border-velora-border shadow-xl rounded-md z-50 py-1 divide-y divide-velora-border/50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-velora-textMuted">
                      Select Model
                    </div>
                    {AVAILABLE_MODELS.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => {
                          onSelectModel(model.id);
                          setIsModelMenuOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-velora-surface transition-colors ${
                          activeModel === model.id ? 'bg-velora-surface border-l-2 border-velora-copper' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-medium text-velora-text">
                            {model.name}
                          </span>
                          {model.badge && (
                            <span className="text-[9px] font-mono text-velora-copper uppercase px-1 py-0.2 bg-velora-copper/10 rounded-sm">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-velora-textMuted line-clamp-1 mt-0.5 font-sans">
                          {model.tagline}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Prompt Vault shortcut */}
            <button
              type="button"
              onClick={onOpenVault}
              className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated rounded-sm transition-colors"
              title="Open Prompt Vault (⌘V)"
            >
              <BookMarked className="w-3 h-3 text-velora-copper" />
              <span className="hidden sm:inline">Vault</span>
            </button>
          </div>

          {/* Right: Send Button */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] font-mono text-velora-textMuted/40">
              ↵ to send
            </span>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center justify-center h-6 w-6 bg-velora-copper hover:bg-velora-copperLight active:scale-[0.96] text-white disabled:opacity-20 disabled:pointer-events-none rounded-sm transition-all"
              aria-label="Send message"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
