import React, { useRef, useEffect } from 'react';
import { BookMarked, Swords, ArrowUpRight } from 'lucide-react';
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

const STARTER_CHIPS = [
  {
    title: 'Deconstruct consensus algorithms from first principles',
    prompt: 'Deconstruct modern distributed consensus algorithms from physical and mathematical first principles. What underlying invariants govern Raft vs Paxos vs BFT?',
  },
  {
    title: 'Adversarial failure mode analysis for CQRS pipeline',
    prompt: 'Conduct an adversarial failure mode analysis for an event-driven CQRS pipeline under high concurrency and network partitions.',
  },
  {
    title: 'Stress-test vertical AI agents vs horizontal foundation models',
    prompt: 'Act as an adversarial partner. Stress-test the thesis that vertical AI agents will commoditize horizontal foundation model providers over a 3-year horizon.',
  },
  {
    title: 'Map system dynamics and 2nd order feedback loops',
    prompt: 'Map out the 2nd and 3rd order unintended consequences and feedback loops for implementing automated algorithmic pricing in a two-sided marketplace.',
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
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in-0 duration-300">
          {/* Hero Typography */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-velora-text leading-[1.15]">
              Think beyond the <span className="italic text-velora-copper">first answer</span>.
            </h1>
            <p className="text-sm text-velora-textMuted max-w-md mx-auto leading-relaxed">
              Explore branching thought paths, benchmark models side-by-side in Arena, and refine reasoning without limits.
            </p>
          </div>

          {/* Quick Capability Actions */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onOpenArena}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-xs text-velora-text rounded-full transition-all active:scale-95"
            >
              <Swords className="w-3.5 h-3.5 text-velora-copper" />
              <span>Model Arena</span>
            </button>

            <button
              onClick={onOpenVault}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-xs text-velora-text rounded-full transition-all active:scale-95"
            >
              <BookMarked className="w-3.5 h-3.5 text-velora-copper" />
              <span>Prompt Vault</span>
            </button>
          </div>

          {/* Clean Suggestion Chips (Aceternity / Claude style, NO clunky boxes) */}
          <div className="pt-2 text-left space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-velora-textMuted/40 text-center mb-3">
              Explore a line of inquiry:
            </div>

            <div className="flex flex-col gap-2">
              {STARTER_CHIPS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPromptStarter(item.prompt)}
                  className="w-full text-left p-3.5 px-4 bg-white/[0.02] hover:bg-white/[0.06] rounded-xl transition-all flex items-center justify-between group"
                >
                  <span className="text-[13.5px] text-velora-text/80 group-hover:text-velora-text transition-colors">
                    {item.title}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-velora-textMuted/40 group-hover:text-velora-copper transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const linearNodes = getLinearPath(conversation);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full flex flex-col justify-between pt-4">
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
        <div ref={bottomRef} className="h-6" />
      </div>
    </div>
  );
};
