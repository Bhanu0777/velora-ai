import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, BookMarked, GitBranch, Shield, Sparkles, Swords, X } from 'lucide-react';

interface LandingHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterWorkspace: () => void;
}

export const LandingHeroModal: React.FC<LandingHeroModalProps> = ({
  isOpen,
  onClose,
  onEnterWorkspace,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 animate-in fade-in-0 duration-300" />
        <Dialog.Content className="fixed inset-4 sm:inset-10 md:inset-16 bg-velora-bg border border-velora-border shadow-2xl rounded-xs z-50 overflow-y-auto flex flex-col p-6 sm:p-12 animate-in zoom-in-95 duration-250 select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-velora-border">
            <div className="flex items-center gap-2.5">
              <span className="font-serif font-bold text-xl tracking-tight text-velora-text">
                VELORA
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-velora-surface text-velora-copper border border-velora-border rounded-xs">
                Editorial Manifesto
              </span>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-velora-textMuted hover:text-velora-text transition-colors p-1.5 border border-velora-border rounded-xs"
                aria-label="Close manifesto"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Hero Section */}
          <div className="py-12 md:py-16 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-velora-surface border border-velora-border text-velora-sage text-xs font-mono uppercase tracking-widest rounded-xs">
              <span className="w-1.5 h-1.5 bg-velora-sage" />
              Editorial Intelligence Meets Digital Craft
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-velora-text leading-[1.12]">
              Think beyond the <span className="text-velora-copper italic font-normal">first answer</span>.
            </h1>

            <p className="text-base sm:text-lg text-velora-textMuted font-sans max-w-xl mx-auto leading-relaxed">
              Ordinary chat interfaces force linear conformism. VELORA is an uncompromising AI workspace designed for architects, researchers, and strategists who treat dialogue as exploratory thought.
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  onClose();
                  onEnterWorkspace();
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-velora-copper hover:bg-velora-copperLight active:scale-[0.98] text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-xs transition-all shadow-lg"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Architectural Pillars — Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto py-8 border-t border-velora-border">
            {/* Pillar 1 */}
            <div className="p-6 bg-velora-surface border border-velora-border rounded-xs space-y-3">
              <div className="w-8 h-8 rounded-xs bg-velora-elevated border border-velora-border flex items-center justify-center text-velora-copper">
                <GitBranch className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-velora-text">
                Conversation Branching
              </h3>
              <p className="text-xs text-velora-textMuted font-sans leading-relaxed">
                Step sideways into alternative trains of thought at any turn. Never lose your primary thread when exploring a tangential hypothesis.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-velora-surface border border-velora-border rounded-xs space-y-3">
              <div className="w-8 h-8 rounded-xs bg-velora-elevated border border-velora-border flex items-center justify-center text-velora-copper">
                <Swords className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-velora-text">
                Dual-Model Arena
              </h3>
              <p className="text-xs text-velora-textMuted font-sans leading-relaxed">
                Benchmark reasoning rigor between GPT-4o, Claude 3.5 Sonnet, and DeepSeek concurrently. Adopt the winner directly into your master thread.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-velora-surface border border-velora-border rounded-xs space-y-3">
              <div className="w-8 h-8 rounded-xs bg-velora-elevated border border-velora-border flex items-center justify-center text-velora-copper">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-velora-text">
                Puter Zero-Retention Privacy
              </h3>
              <p className="text-xs text-velora-textMuted font-sans leading-relaxed">
                No third-party tracking databases or intermediary servers. Your transcripts exist in client storage or your isolated Puter cloud drive.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-8 border-t border-velora-border mt-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-velora-textMuted/70 gap-2">
            <span>VELORA • Editorial Intelligence</span>
            <span>Powered by Puter.js • PWA Standalone Ready</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
