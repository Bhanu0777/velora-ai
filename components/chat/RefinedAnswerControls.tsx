import React from 'react';
import {
  Zap,
  BookOpen,
  ListFilter,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { AnswerControlAction } from '@/lib/types';

interface RefinedAnswerControlsProps {
  onSelectAction: (action: AnswerControlAction, directive: string) => void;
  disabled?: boolean;
}

export const ANSWER_CONTROLS: Array<{
  id: AnswerControlAction;
  label: string;
  directive: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'explain-simply',
    label: 'Explain Simply',
    directive: 'Explain the preceding response in simple, crystal-clear terms with minimal technical jargon, preserving core insights.',
    icon: Zap,
  },
  {
    id: 'give-examples',
    label: 'Give Examples',
    directive: 'Provide concrete, real-world examples and code/scenario implementations directly illustrating the preceding points.',
    icon: BookOpen,
  },
  {
    id: 'summarize',
    label: 'Summarize',
    directive: 'Distill the preceding analysis into high-density executive bullet points and key takeaways.',
    icon: ListFilter,
  },
  {
    id: 'go-deeper',
    label: 'Go Deeper',
    directive: 'Explore the underlying mechanisms, second-order systemic effects, and advanced technical trade-offs of this answer.',
    icon: Compass,
  },
  {
    id: 'challenge',
    label: 'Challenge Answer',
    directive: 'Act as an adversarial critic. Challenge the assumptions, expose potential failure modes, and present counter-theses to this answer.',
    icon: AlertCircle,
  },
];

export const RefinedAnswerControls: React.FC<RefinedAnswerControlsProps> = ({
  onSelectAction,
  disabled = false,
}) => {
  return (
    <div className="mt-5 pt-3 border-t border-white/[0.05] select-none">
      <div className="flex flex-wrap items-center gap-2">
        {ANSWER_CONTROLS.map((ctrl) => {
          const Icon = ctrl.icon;
          return (
            <button
              key={ctrl.id}
              onClick={() => onSelectAction(ctrl.id, ctrl.directive)}
              disabled={disabled}
              className="group/pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.08] hover:border-velora-copper/30 border border-white/[0.04] rounded-full transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon className="w-3 h-3 text-velora-copper opacity-70 group-hover/pill:opacity-100 transition-opacity" />
              <span>{ctrl.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

