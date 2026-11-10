import React, { useRef, useEffect } from 'react';
import { BookMarked, GitBranch, Sparkles, Swords, ArrowRight } from 'lucide-react';
import { ConversationTree, AnswerControlAction } from '@/lib/types';
import { EditorialMessage } from './EditorialMessage';
import { getLinearPath, getBranchSiblingInfo } from '@/lib/storage/tree-manager';

interface EditorialChatViewProps {
  conversation: ConversationTree | null;
  isStreaming: boolean;
  streamingNodeId: string | null;
  onNavigateBranch: (nodeId: string, newIndex: number) => void;
  onAnswerControl: (nodeId: string, action: AnswerControlAction, directive: string) => void;
  onForkTurn: (nodeId: string) => void;
  onToggleBookmark: (messageId: string, content: string, model: string, note?: string) => void;
  bookmarksMap: Record<string, string>;
  onSelectPromptStarter: (prompt: string) => void;
  onOpenArena: () => void;
  onOpenVault: () => void;
  onOpenLanding: () => void;
}

const CURATED_FRAMEWORKS = [
  {
    category: 'Strategy',
    title: 'First-Principles Deconstruction',
    prompt: 'Deconstruct modern distributed consensus algorithms from physical and mathematical first principles. What underlying invariants govern Raft vs Paxos vs BFT?',
    tag: 'Core Physics',
  },
  {
    category: 'Architecture',
    title: 'Zero-Trust Architectural Audit',
    prompt: 'Conduct an adversarial failure mode analysis for an event-driven CQRS pipeline under high concurrency and network partitions. Identify silent data corruption vectors.',
    tag: 'Systems Audit',
  },
  {
    category: 'Analysis',
    title: 'Socratic Hypothesis Stress-Test',
    prompt: 'Act as an adversarial principal partner. Stress-test the thesis that vertical AI agents will commoditize horizontal foundation model providers over a 3-year horizon.',
    tag: 'Adversarial',
  },
];

export const EditorialChatView: React.FC<EditorialChatViewProps> = ({
  conversation,
  isStreaming,
  streamingNodeId,
  onNavigateBranch,
  onAnswerControl,
  onForkTurn,
  onToggleBookmark,
  bookmarksMap,
  onSelectPromptStarter,
  onOpenArena,
  onOpenVault,
  onOpenLanding,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isStreaming, conversation?.nodes]);

  if (!conversation || Object.keys(conversation.nodes).length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center select-none overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Tagline & Identity */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-velora-surface border border-velora-border text-velora-copper text-[10px] font-mono uppercase tracking-widest rounded-xs">
              <span className="w-1.5 h-1.5 bg-velora-copper" />
              Editorial Intelligence
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-velora-text leading-[1.15]">
              Think beyond the first answer.
            </h1>
            
            <p className="text-sm sm:text-base text-velora-textMuted font-sans max-w-lg mx-auto leading-relaxed">
              A high-precision AI workspace engineered for deep inquiry. Fork alternative conversation branches, benchmark dual models in the Arena, and curate analytical frameworks.
            </p>
          </div>

          {/* Quick Capability Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenArena}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-velora-surface hover:bg-velora-elevated text-xs font-mono text-velora-text border border-velora-border hover:border-velora-copper/60 rounded-xs transition-all shadow-sm"
            >
              <Swords className="w-3.5 h-3.5 text-velora-copper" />
              <span>Model Arena Duel</span>
            </button>

            <button
              onClick={onOpenVault}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-velora-surface hover:bg-velora-elevated text-xs font-mono text-velora-text border border-velora-border hover:border-velora-copper/60 rounded-xs transition-all shadow-sm"
            >
              <BookMarked className="w-3.5 h-3.5 text-velora-copper" />
              <span>Prompt Vault</span>
            </button>

            <button
              onClick={onOpenLanding}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-velora-textMuted hover:text-velora-text hover:underline transition-colors"
            >
              <span>Explore Manifesto</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Curated Prompt Starters */}
          <div className="space-y-3 pt-2 text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted/70 pl-1 flex items-center justify-between">
              <span>Select an Initial Invariant or Framework</span>
              <span className="text-[9px] text-velora-sage">Click to dispatch</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {CURATED_FRAMEWORKS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectPromptStarter(item.prompt)}
                  className="p-4 bg-velora-surface hover:bg-velora-elevated border border-velora-border hover:border-velora-copper/50 rounded-xs transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1.5">
                    <span className="text-velora-copper font-medium">{item.category}</span>
                    <span className="text-velora-textMuted/60 group-hover:text-velora-sage transition-colors">
                      {item.tag} ↵
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-velora-text mb-1 group-hover:text-velora-copperLight transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[12.5px] text-velora-textMuted leading-relaxed line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const linearNodes = getLinearPath(conversation);

  return (
    <div className="flex-1 overflow-y-auto editorial-canvas-bg">
      <div className="min-h-full flex flex-col justify-between">
        <div>
          {linearNodes.map((node) => {
            const siblingInfo = getBranchSiblingInfo(conversation, node.id);
            const isCurrentlyStreaming = isStreaming && streamingNodeId === node.id;
            const isBookmarked = node.id in bookmarksMap;
            const note = bookmarksMap[node.id];

            return (
              <EditorialMessage
                key={node.id}
                node={node}
                siblingInfo={siblingInfo}
                isStreaming={isCurrentlyStreaming}
                onNavigateBranch={(newIndex) => onNavigateBranch(node.id, newIndex)}
                onAnswerControl={(action, directive) => onAnswerControl(node.id, action, directive)}
                onForkTurn={() => onForkTurn(node.id)}
                onToggleBookmark={(msgId, content, model, noteText) =>
                  onToggleBookmark(msgId, content, model, noteText)
                }
                isBookmarked={isBookmarked}
                bookmarkNote={note}
              />
            );
          })}
        </div>
        <div ref={bottomRef} className="h-8" />
      </div>
    </div>
  );
};

