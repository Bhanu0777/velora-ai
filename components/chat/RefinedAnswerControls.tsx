import React from 'react';
import { BookOpen, Code2, Compass, FileText, ShieldAlert, Sparkles } from 'lucide-react';
import { AnswerControlAction } from '@/lib/types';

interface RefinedAnswerControlsProps {
  onSelectAction: (action: AnswerControlAction, directive: string) => void;
  disabled?: boolean;
}

const CONTROLS: Array<{
  id: AnswerControlAction;
  label: string;
  directive: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}> = [
  {
    id: 'explain-simply',
    label: 'Explain Simply',
    directive: 'Explain the preceding response in simple, crystal-clear terms with minimal technical jargon, preserving core insights.',
    icon: BookOpen,
    tag: 'Clarity',
  },
  {
    id: 'give-examples',
    label: 'Give Examples',
    directive: 'Provide concrete, real-world examples and code/scenario implementations directly illustrating the preceding points.',
    icon: Code2,
    tag: 'Empirical',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    directive: 'Distill the preceding analysis into high-density executive bullet points and key takeaways.',
    icon: FileText,
    tag: 'Executive',
  },
  {
    id: 'go-deeper',
    label: 'Go Deeper',
    directive: 'Explore the underlying mechanisms, second-order systemic effects, and advanced technical trade-offs of this answer.',
    icon: Compass,
    tag: 'Mechanics',
  },
  {
    id: 'challenge',
    label: 'Challenge This',
    directive: 'Act as an adversarial critic. Challenge the assumptions, expose potential failure modes, and present counter-theses to this answer.',
    icon: ShieldAlert,
    tag: 'Adversarial',
  },
];

export const RefinedAnswerControls: React.FC<RefinedAnswerControlsProps> = ({
  onSelectAction,
  disabled = false,
}) => {
  return (
    <div className="pt-4 pb-1 border-t border-velora-border/60 mt-5 select-none">
      <div className="text-[10px] uppercase font-mono tracking-widest text-velora-textMuted flex items-center justify-between mb-2.5">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-velora-copper inline-block" />
          <span>Editorial Refinements</span>
        </span>
        <span className="text-[9px] text-velora-sage font-mono">
          Forks non-destructive branch
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {CONTROLS.map((ctrl) => {
          const Icon = ctrl.icon;
          return (
            <button
              key={ctrl.id}
              onClick={() => onSelectAction(ctrl.id, ctrl.directive)}
              disabled={disabled}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-sans bg-velora-surface hover:bg-velora-elevated text-velora-text border border-velora-border hover:border-velora-copper/60 rounded-xs transition-all group disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <Icon className="w-3.5 h-3.5 text-velora-textMuted group-hover:text-velora-copper transition-colors" />
              <span className="font-medium">{ctrl.label}</span>
              <span className="text-[9px] font-mono uppercase text-velora-textMuted/60 bg-velora-elevated/60 px-1 py-0.2 rounded-xs border border-velora-border/40">
                {ctrl.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
