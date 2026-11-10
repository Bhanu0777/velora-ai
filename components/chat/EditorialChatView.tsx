import React, { useRef, useEffect } from 'react';
import { BookMarked, Swords, ArrowRight } from 'lucide-react';
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

const STARTER_PROMPTS = [
  {
    category: 'Analysis',
    title: 'First-principles deconstruction',
    prompt: 'Deconstruct modern distributed consensus algorithms from physical and mathematical first principles. What underlying invariants govern Raft vs Paxos vs BFT?',
  },
  {
    category: 'Architecture',
    title: 'Failure mode stress-test',
    prompt: 'Conduct an adversarial failure mode analysis for an event-driven CQRS pipeline under high concurrency and network partitions.',
  },
  {
    category: 'Strategy',
    title: 'Socratic business critique',
    prompt: 'Act as an adversarial partner. Stress-test the thesis that vertical AI agents will commoditize horizontal foundation model providers over a 3-year horizon.',
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
        <div className="max-w-xl mx-auto space-y-7">
          {/* Identity */}
          <div className="space-y-2.5">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-velora-text">
              Think beyond the first answer.
            </h1>
            <p className="text-sm text-velora-textMuted max-w-md mx-auto leading-relaxed">
              Explore alternative paths with Conversation Branching, compare reasoning in Model Arena, and refine answers with precision.
            </p>
          </div>

          {/* Action Pills */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onOpenArena}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-velora-surface hover:bg-velora-elevated text-xs font-mono text-velora-text border border-velora-border rounded-sm transition-colors"
            >
              <Swords className="w-3.5 h-3.5 text-velora-copper" />
              <span>Model Arena</span>
            </button>

            <button
              onClick={onOpenVault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-velora-surface hover:bg-velora-elevated text-xs font-mono text-velora-text border border-velora-border rounded-sm transition-colors"
            >
              <BookMarked className="w-3.5 h-3.5 text-velora-copper" />
              <span>Prompt Vault</span>
            </button>
          </div>

          {/* Clean Starter Prompts */}
          <div className="space-y-2 pt-2 text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted/50 pl-1">
              Example inquiries:
            </div>

            <div className="space-y-1.5">
              {STARTER_PROMPTS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectPromptStarter(item.prompt)}
                  className="p-3 bg-velora-surface/60 hover:bg-velora-surface border border-velora-border/70 hover:border-velora-copper/40 rounded-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-velora-copper mb-0.5">
                    <span>{item.category}</span>
                    <span className="text-velora-textMuted/40 group-hover:text-velora-textMuted transition-colors">↵</span>
                  </div>
                  <div className="text-xs font-medium text-velora-text group-hover:text-velora-copperLight transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[12px] text-velora-textMuted/70 line-clamp-1 mt-0.5 font-sans">
                    {item.prompt}
                  </div>
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
    <div className="flex-1 overflow-y-auto">
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
        <div ref={bottomRef} className="h-6" />
      </div>
    </div>
  );
};
