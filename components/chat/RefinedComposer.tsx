import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, BookMarked, ChevronDown, GitBranch, Sparkles, X } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/lib/puter/ai';
import { animateComposerFocus } from '@/lib/gsap/gsap-interactions';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Auto-resize textarea smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [input]);

  const handleFocus = () => {
    animateComposerFocus(containerRef.current, true);
  };

  const handleBlur = () => {
    animateComposerFocus(containerRef.current, false);
  };

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
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 pb-6 pt-2">
      {/* Branching Banner if branching from an earlier turn */}
      {branchingFromNodeId && (
        <div className="flex items-center justify-between px-3.5 py-1.5 mb-2.5 bg-velora-surface border border-velora-copper/40 text-velora-copperLight text-xs font-mono rounded-xs animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-velora-copper" />
            <span>
              Spawning alternative fork from turn <strong className="font-semibold text-velora-text">#{branchingFromNodeId.slice(-4)}</strong>
            </span>
          </div>
          {onCancelBranching && (
            <button
              onClick={onCancelBranching}
              className="text-velora-textMuted hover:text-velora-text flex items-center gap-1 text-[11px] hover:underline"
            >
              <X className="w-3 h-3" />
              <span>Cancel (Esc)</span>
            </button>
          )}
        </div>
      )}

      {/* Main Composer Box */}
      <div
        ref={containerRef}
        className="relative flex flex-col bg-velora-surface border border-velora-border rounded-xs transition-colors shadow-lg"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Frame a thesis, deconstruct a problem, or command an editorial audit..."
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-5 pt-4 pb-3 text-[14.5px] leading-relaxed text-velora-text placeholder:text-velora-textMuted/50 outline-none font-sans"
        />

        {/* Toolbar & Status Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-velora-border/60 text-xs select-none bg-velora-surface/60">
          {/* Left Actions: Model Switcher & Vault */}
          <div className="flex items-center gap-2">
            {/* Model Switcher Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] text-velora-text bg-velora-elevated hover:bg-velora-elevated/80 border border-velora-border hover:border-velora-copper/50 rounded-xs transition-all"
              >
                <span className="w-1.5 h-1.5 bg-velora-sage rounded-none inline-block" />
                <span className="font-medium">{currentModel.name}</span>
                <ChevronDown className="w-3 h-3 text-velora-textMuted" />
              </button>

              {isModelMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsModelMenuOpen(false)} />
                  <div className="absolute left-0 bottom-full mb-1.5 w-64 bg-velora-elevated border border-velora-border shadow-2xl rounded-xs z-50 py-1 divide-y divide-velora-border/50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-velora-textMuted">
                      Select Foundational Engine
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
                            <span className="text-[9px] font-mono text-velora-copper uppercase px-1 py-0.2 bg-velora-copper/10 border border-velora-copper/30 rounded-xs">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-velora-textMuted line-clamp-1 mt-0.5">
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated/60 transition-colors border border-transparent hover:border-velora-border rounded-xs"
              title="Open Prompt Vault (⌘V)"
            >
              <BookMarked className="w-3.5 h-3.5 text-velora-copper" />
              <span className="hidden sm:inline">Prompt Vault</span>
            </button>
          </div>

          {/* Right Actions: Shortcut hint & Send button */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[10px] font-mono text-velora-textMuted/70">
              Return ↵ to dispatch
            </span>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center justify-center h-7 w-7 bg-velora-copper hover:bg-velora-copperLight active:scale-[0.96] text-white disabled:opacity-30 disabled:pointer-events-none rounded-xs transition-all shadow-sm"
              aria-label="Dispatch prompt"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
