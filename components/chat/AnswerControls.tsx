import React from 'react';
import { BookOpen, ListTree, FileText, Compass, ShieldAlert } from 'lucide-react';
import { AnswerControlAction } from '@/lib/types';

interface AnswerControlsProps {
  onSelectAction: (action: AnswerControlAction, directive: string) => void;
  disabled?: boolean;
}

const CONTROLS: Array<{
  id: AnswerControlAction;
  label: string;
  directive: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: 'explain-simply',
    label: 'Explain Simply',
    directive: 'Explain the preceding response in simple, crystal-clear terms with minimal technical jargon, preserving core insights.',
    icon: BookOpen,
    description: 'Demystify concepts into clear language',
  },
  {
    id: 'give-examples',
    label: 'Give Examples',
    directive: 'Provide concrete, real-world examples and code/scenario implementations directly illustrating the preceding points.',
    icon: ListTree,
    description: 'Practical scenario demonstrations',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    directive: 'Distill the preceding analysis into high-density executive bullet points and key takeaways.',
    icon: FileText,
    description: 'Executive takeaways and thesis points',
  },
  {
    id: 'go-deeper',
    label: 'Go Deeper',
    directive: 'Explore the underlying mechanisms, second-order systemic effects, and advanced technical trade-offs of this answer.',
    icon: Compass,
    description: 'Examine deeper causal mechanisms',
  },
  {
    id: 'challenge',
    label: 'Challenge This',
    directive: 'Act as an adversarial critic. Challenge the assumptions, expose potential failure modes, and present counter-theses to this answer.',
    icon: ShieldAlert,
    description: 'Stress-test assumptions & edge cases',
  },
];

export const AnswerControls: React.FC<AnswerControlsProps> = ({
  onSelectAction,
  disabled = false,
}) => {
  return (
    <div className="pt-3 pb-1 border-t border-border/40 mt-4">
      <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground/80 mb-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-editorial-bronze inline-block" />
        Editorial Answer Controls
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {CONTROLS.map((ctrl) => {
          const Icon = ctrl.icon;
          return (
            <button
              key={ctrl.id}
              onClick={() => onSelectAction(ctrl.id, ctrl.directive)}
              disabled={disabled}
              title={ctrl.description}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans tracking-wide bg-muted/40 hover:bg-muted text-foreground/90 hover:text-foreground border border-border/70 hover:border-editorial-bronze/50 transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed group active:translate-y-[0.5px]"
            >
              <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-editorial-bronze transition-colors" />
              <span>{ctrl.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

