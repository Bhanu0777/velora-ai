import React from 'react';
import { ChevronLeft, ChevronRight, GitFork } from 'lucide-react';

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
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono select-none text-velora-textMuted bg-white/[0.03] rounded-full ${className}`}
    >
      <GitFork className="w-3 h-3 text-velora-copper mr-0.5" />

      <button
        type="button"
        className="h-4 w-4 flex items-center justify-center text-velora-textMuted hover:text-white rounded-full transition-colors disabled:opacity-20"
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={currentIndex <= 0}
        aria-label="Previous fork"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>

      <span className="px-1 text-white font-medium text-[10px]">
        {currentIndex + 1} / {total}
      </span>

      <button
        type="button"
        className="h-4 w-4 flex items-center justify-center text-velora-textMuted hover:text-white rounded-full transition-colors disabled:opacity-20"
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={currentIndex >= total - 1}
        aria-label="Next fork"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};
