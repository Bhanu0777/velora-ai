import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bookmark, Check, Copy, GitBranch, Quote, Sparkles } from 'lucide-react';
import { MessageNode, AnswerControlAction } from '@/lib/types';
import { CodeBlock } from './CodeBlock';
import { BranchConnectorHUD } from './BranchConnectorHUD';
import { RefinedAnswerControls } from './RefinedAnswerControls';
import { BookmarkNoteModal } from '../bookmarks/BookmarkNoteModal';
import { animateMessageEntrance, animateBranchShift } from '@/lib/gsap/gsap-interactions';

interface EditorialMessageProps {
  node: MessageNode;
  siblingInfo: {
    currentIndex: number;
    total: number;
  };
  isStreaming?: boolean;
  onNavigateBranch: (newIndex: number) => void;
  onAnswerControl: (action: AnswerControlAction, directive: string) => void;
  onForkTurn: (nodeId: string) => void;
  onToggleBookmark: (messageId: string, content: string, model: string, note?: string) => void;
  isBookmarked: boolean;
  bookmarkNote?: string;
}

export const EditorialMessage: React.FC<EditorialMessageProps> = ({
  node,
  siblingInfo,
  isStreaming = false,
  onNavigateBranch,
  onAnswerControl,
  onForkTurn,
  onToggleBookmark,
  isBookmarked,
  bookmarkNote,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    animateMessageEntrance(containerRef.current);
  }, [node.id]);

  const handleBranchNavigation = (newIndex: number) => {
    animateBranchShift(containerRef.current, newIndex > siblingInfo.currentIndex ? 'right' : 'left');
    onNavigateBranch(newIndex);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(node.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const isUser = node.role === 'user';

  return (
    <div
      ref={containerRef}
      className={`relative py-8 px-4 sm:px-8 border-b border-velora-border/60 transition-colors ${
        isUser
          ? 'bg-velora-surface/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Turn Metadata Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3 select-none">
          <div className="flex items-center gap-3">
            {isUser ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-velora-elevated text-velora-sage border border-velora-border rounded-xs">
                  Inquiry
                </span>
                <span className="text-velora-textMuted/60 text-[10px] font-mono">
                  {new Date(node.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 bg-velora-elevated text-velora-copperLight border border-velora-border rounded-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-velora-copper inline-block" />
                  {node.model || 'Model Reflection'}
                </span>
                <span className="text-velora-textMuted/60 text-[10px] font-mono">
                  {new Date(node.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Sibling Branch Indicator (if more than 1 sibling) */}
          <BranchConnectorHUD
            currentIndex={siblingInfo.currentIndex}
            total={siblingInfo.total}
            onNavigate={handleBranchNavigation}
          />
        </div>

        {/* Message Content Body */}
        <div className="text-[15px] leading-[1.8] font-sans text-velora-text selection:bg-velora-copper selection:text-white">
          {isUser ? (
            <div className="relative pl-4 border-l-2 border-velora-copper/70 py-1">
              <p className="whitespace-pre-wrap font-serif text-[17px] leading-relaxed text-velora-text">
                {node.content}
              </p>
            </div>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none text-[15px] leading-[1.85] font-sans">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    if (!inline && match) {
                      return <CodeBlock language={match[1]} value={codeString} />;
                    }
                    if (!inline) {
                      return <CodeBlock value={codeString} />;
                    }
                    return (
                      <code
                        className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-velora-elevated text-velora-copperLight rounded-xs border border-velora-border"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {node.content || (isStreaming ? 'Synthesizing response...' : '')}
              </ReactMarkdown>

              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1.5 bg-velora-copper animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Turn Utility Bar */}
        <div className="flex items-center justify-between pt-4 mt-3 text-[11px] font-mono text-velora-textMuted border-t border-velora-border/40 select-none">
          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2 py-1 hover:text-velora-text hover:bg-velora-elevated rounded-xs transition-colors"
              title="Copy message text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-velora-sage" />
                  <span className="text-velora-sage font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Bookmark button (assistant only) */}
            {!isUser && (
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xs transition-colors ${
                  isBookmarked
                    ? 'text-velora-copper bg-velora-copper/10 border border-velora-copper/30 font-medium'
                    : 'hover:text-velora-text hover:bg-velora-elevated'
                }`}
                title={isBookmarked ? 'Edit bookmark annotation' : 'Bookmark reflection'}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            )}

            {/* Fork Branch from here */}
            <button
              onClick={() => onForkTurn(node.id)}
              className="inline-flex items-center gap-1.5 px-2 py-1 hover:text-velora-copper hover:bg-velora-elevated rounded-xs transition-colors"
              title="Fork alternative analytical branch from this turn"
            >
              <GitBranch className="w-3.5 h-3.5 text-velora-copper" />
              <span>Fork Branch</span>
            </button>
          </div>

          {/* Bookmarked user note preview */}
          {!isUser && isBookmarked && bookmarkNote && (
            <div className="text-[11px] text-velora-copper/90 italic truncate max-w-sm font-serif pl-3 border-l border-velora-border">
              Note: "{bookmarkNote}"
            </div>
          )}
        </div>

        {/* Editorial Answer Controls (Assistant turns, when not actively streaming) */}
        {!isUser && !isStreaming && node.content && (
          <RefinedAnswerControls onSelectAction={onAnswerControl} />
        )}

        {/* Annotation Dialog */}
        <BookmarkNoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          onSave={(note) => {
            onToggleBookmark(node.id, node.content, node.model || 'AI Model', note);
          }}
          initialNote={bookmarkNote}
          isBookmarked={isBookmarked}
        />
      </div>
    </div>
  );
};
