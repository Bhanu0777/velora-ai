import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, BookMarked, ChevronDown, GitBranch, X } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/lib/puter/ai';
import { MagneticButton } from '../ui/MagneticButton';

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
    <div className="relative w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
      {/* Branching Banner if branching */}
      {branchingFromNodeId && (
        <div className="flex items-center justify-between px-4 py-1.5 mb-2 bg-[#1C1F26] text-velora-copperLight text-xs font-mono rounded-full animate-in fade-in-0 duration-150 border border-velora-copper/20">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-velora-copper" />
            <span>Forking new branch from turn #{branchingFromNodeId.slice(-4)}</span>
          </div>
          {onCancelBranching && (
            <button
              onClick={onCancelBranching}
              className="text-velora-textMuted hover:text-velora-text flex items-center gap-1 text-[11px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Fluid Island Composer — Aceternity / Linear Style */}
      <div className="relative bg-[#14161A]/90 backdrop-blur-xl border border-white/10 focus-within:border-white/20 rounded-2xl shadow-2xl transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything or explore a thesis..."
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-[15px] leading-relaxed text-velora-text placeholder:text-velora-textMuted/40 outline-none font-sans"
        />

        {/* Minimal Bottom Bar */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1 text-xs select-none">
          {/* Left: Model Pill & Vault Trigger */}
          <div className="flex items-center gap-1">
            {/* Model Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.04] hover:bg-white/[0.08] rounded-full transition-colors font-medium"
              >
                <span className="w-1.5 h-1.5 bg-velora-copper rounded-full inline-block" />
                <span>{currentModel.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isModelMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsModelMenuOpen(false)} />
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#181B20] border border-white/10 shadow-2xl rounded-xl z-50 py-1.5 divide-y divide-white/[0.06] animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-velora-textMuted/60">
                      Select Model
                    </div>
                    {AVAILABLE_MODELS.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => {
                          onSelectModel(model.id);
                          setIsModelMenuOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-white/[0.04] transition-colors ${
                          activeModel === model.id ? 'bg-white/[0.06] text-white' : 'text-velora-textMuted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-velora-text">
                            {model.name}
                          </span>
                          {model.badge && (
                            <span className="text-[9px] font-mono text-velora-copper uppercase px-1.5 py-0.5 bg-velora-copper/10 rounded-full">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-velora-textMuted/70 line-clamp-1 mt-0.5">
                          {model.tagline}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Prompt Vault Pill */}
            <button
              type="button"
              onClick={onOpenVault}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.04] hover:bg-white/[0.08] rounded-full transition-colors"
              title="Open Prompt Vault"
            >
              <BookMarked className="w-3 h-3 text-velora-copper" />
              <span>Vault</span>
            </button>
          </div>

          {/* Right: Circular Send Button with Magnetic micro-interaction */}
          <MagneticButton
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-velora-copper hover:bg-velora-copperLight active:scale-95 text-white disabled:opacity-20 disabled:pointer-events-none transition-colors shadow-md"
            aria-label="Send message"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
