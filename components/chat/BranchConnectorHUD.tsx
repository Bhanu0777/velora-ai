import React from 'react';
import { ChevronLeft, ChevronRight, GitBranch, GitFork } from 'lucide-react';

interface BranchConnectorHUDProps {
  currentIndex: number;
  total: number;
  onNavigate: (newIndex: number) => void;
  className?: string;
}

export const BranchConnectorHUD: React.FC<BranchConnectorHUDProps> = ({
  currentIndex,
  total,
  onNavigate,
  className = '',
}) => {
  if (total <= 1) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 bg-velora-surface border border-velora-border text-[11px] font-mono select-none rounded-xs ${className}`}
    >
      <div className="flex items-center gap-1 text-velora-copper pr-1.5 border-r border-velora-border">
        <GitFork className="w-3 h-3 text-velora-copper" />
        <span className="uppercase text-[9px] tracking-widest font-semibold">Fork</span>
      </div>

      <button
        type="button"
        className="h-5 w-5 flex items-center justify-center text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated disabled:opacity-30 disabled:pointer-events-none rounded-xs transition-colors"
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={currentIndex <= 0}
        aria-label="Previous fork"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>

      <span className="px-1 text-velora-text font-medium text-[10px]">
        {String(currentIndex + 1).padStart(2, '0')}{' '}
        <span className="text-velora-textMuted/60">/</span> {String(total).padStart(2, '0')}
      </span>

      <button
        type="button"
        className="h-5 w-5 flex items-center justify-center text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated disabled:opacity-30 disabled:pointer-events-none rounded-xs transition-colors"
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={currentIndex >= total - 1}
        aria-label="Next fork"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

