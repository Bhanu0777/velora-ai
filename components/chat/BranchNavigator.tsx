import React from 'react';
import { ChevronLeft, ChevronRight, GitBranch } from 'lucide-react';
import { Button } from '../ui/button';

interface BranchNavigatorProps {
  currentIndex: number;
  total: number;
  onNavigate: (newIndex: number) => void;
  className?: string;
}

export const BranchNavigator: React.FC<BranchNavigatorProps> = ({
  currentIndex,
  total,
  onNavigate,
  className = '',
}) => {
  if (total <= 1) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 bg-muted/40 border border-border/80 text-[11px] font-mono select-none rounded-sm ${className}`}
    >
      <div className="flex items-center gap-1 text-editorial-bronze pr-1 border-r border-border/60">
        <GitBranch className="w-3 h-3" />
        <span className="uppercase text-[9px] tracking-wider font-semibold">Fork</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground disabled:opacity-30"
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={currentIndex <= 0}
        aria-label="Previous branch"
      >
        <ChevronLeft className="w-3 h-3" />
      </Button>

      <span className="px-1 text-foreground font-medium">
        {currentIndex + 1} <span className="text-muted-foreground">/</span> {total}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground disabled:opacity-30"
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={currentIndex >= total - 1}
        aria-label="Next branch"
      >
        <ChevronRight className="w-3 h-3" />
      </Button>
    </div>
  );
};
