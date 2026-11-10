import React from 'react';
import { BookOpen, Code2, Compass, FileText, ShieldAlert } from 'lucide-react';
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
}> = [
  {
    id: 'explain-simply',
    label: 'Explain simply',
    directive: 'Explain the preceding response in simple, crystal-clear terms with minimal technical jargon, preserving core insights.',
    icon: BookOpen,
  },
  {
    id: 'give-examples',
    label: 'Give examples',
    directive: 'Provide concrete, real-world examples and code/scenario implementations directly illustrating the preceding points.',
    icon: Code2,
  },
  {
    id: 'summarize',
    label: 'Summarize',
    directive: 'Distill the preceding analysis into high-density executive bullet points and key takeaways.',
    icon: FileText,
  },
  {
    id: 'go-deeper',
    label: 'Go deeper',
    directive: 'Explore the underlying mechanisms, second-order systemic effects, and advanced technical trade-offs of this answer.',
    icon: Compass,
  },
  {
    id: 'challenge',
    label: 'Challenge answer',
    directive: 'Act as an adversarial critic. Challenge the assumptions, expose potential failure modes, and present counter-theses to this answer.',
    icon: ShieldAlert,
  },
];

export const RefinedAnswerControls: React.FC<RefinedAnswerControlsProps> = ({
  onSelectAction,
  disabled = false,
}) => {
  return (
    <div className="pt-3 mt-3 flex items-center gap-1.5 flex-wrap text-xs select-none">
      <span className="text-[11px] font-mono text-velora-textMuted/60 mr-1">
        Refine:
      </span>

      {CONTROLS.map((ctrl) => {
        const Icon = ctrl.icon;
        return (
          <button
            key={ctrl.id}
            onClick={() => onSelectAction(ctrl.id, ctrl.directive)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-sans text-velora-textMuted hover:text-velora-text hover:bg-velora-surface border border-transparent hover:border-velora-border rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed group active:scale-[0.98]"
          >
            <Icon className="w-3 h-3 text-velora-textMuted/70 group-hover:text-velora-copper transition-colors" />
            <span>{ctrl.label}</span>
          </button>
        );
      })}
    </div>
  );
};
