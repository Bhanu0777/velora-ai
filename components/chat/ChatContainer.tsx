import React, { useRef, useEffect } from 'react';
import { BookMarked, GitBranch, Sparkles, Swords } from 'lucide-react';
import { ConversationTree, MessageNode, AnswerControlAction } from '@/lib/types';
import { MessageTurn } from './MessageTurn';
import { getLinearPath, getBranchSiblingInfo } from '@/lib/storage/tree-manager';

interface ChatContainerProps {
  conversation: ConversationTree | null;
  isStreaming: boolean;
  streamingNodeId: string | null;
  onNavigateBranch: (nodeId: string, newIndex: number) => void;
  onAnswerControl: (nodeId: string, action: AnswerControlAction, directive: string) => void;
  onForkTurn: (nodeId: string) => void;
  onToggleBookmark: (messageId: string, content: string, model: string, note?: string) => void;
  bookmarksMap: Record<string, string>; // messageId -> note
  onSelectPromptStarter: (prompt: string) => void;
  onOpenArena: () => void;
  onOpenVault: () => void;
}

const STARTER_PROMPTS = [
  {
    title: 'Architectural Invariant Review',
    prompt: 'Examine the trade-offs of single-tenant vs multi-tenant database partitioning under extreme compliance and zero-trust requirements. Break down concrete failure modes.',
    badge: 'Systems',
  },
  {
    title: 'Socratic Business Stress-Test',
    prompt: 'Act as an adversarial partner. Stress-test the assumption that adding AI features directly to a B2B SaaS workflow creates a defensible enterprise moat.',
    badge: 'Strategy',
  },
  {
    title: 'First-Principles Deconstruction',
    prompt: 'Deconstruct modern web browser layout rendering from first principles: from TCP packet ingestion, DOM tree generation, CSSOM recalculation, to GPU compositor pipelines.',
    badge: 'Analysis',
  },
];

export const ChatContainer: React.FC<ChatContainerProps> = ({
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

  // Auto-scroll on new content while streaming
  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isStreaming, conversation?.nodes]);

  if (!conversation || Object.keys(conversation.nodes).length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center select-none overflow-y-auto">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-bronze">
              Rigorous Thinking Workspace
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground font-bold tracking-tight">
              VELORA
            </h1>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Editorial Intelligence powered by Puter.js. Compare foundational models, fork alternative conversational paths, and preserve intellectual depth.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenArena}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 hover:bg-muted text-xs font-mono border border-border/80 rounded-sm text-foreground transition-colors"
            >
              <Swords className="w-3.5 h-3.5 text-editorial-bronze" />
              <span>Model Arena Duel</span>
            </button>
            <button
              onClick={onOpenVault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 hover:bg-muted text-xs font-mono border border-border/80 rounded-sm text-foreground transition-colors"
            >
              <BookMarked className="w-3.5 h-3.5 text-editorial-bronze" />
              <span>Explore Prompt Vault</span>
            </button>
          </div>

          {/* Prompt Starters */}
          <div className="space-y-2.5 pt-4 text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80 pl-1">
              Select an Editorial Framework:
            </div>
            {STARTER_PROMPTS.map((starter, i) => (
              <div
                key={i}
                onClick={() => onSelectPromptStarter(starter.prompt)}
                className="p-3.5 bg-card hover:bg-muted/30 border border-border/80 hover:border-editorial-bronze/60 transition-all rounded-sm cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1">
                  <span className="text-editorial-bronze font-semibold">{starter.badge}</span>
                  <span className="text-muted-foreground group-hover:text-foreground">Dispatch ↵</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground mb-0.5">{starter.title}</h4>
                <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {starter.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get active linear message sequence
  const linearNodes = getLinearPath(conversation);

  return (
    <div className="flex-1 overflow-y-auto">
      {linearNodes.map((node) => {
        const siblingInfo = getBranchSiblingInfo(conversation, node.id);
        const isCurrentlyStreaming = isStreaming && streamingNodeId === node.id;
        const isBookmarked = node.id in bookmarksMap;
        const note = bookmarksMap[node.id];

        return (
          <MessageTurn
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
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

