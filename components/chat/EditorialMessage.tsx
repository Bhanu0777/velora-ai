import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bookmark, Check, Copy, GitBranch, MoreHorizontal } from 'lucide-react';
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
      className={`group relative py-6 px-4 sm:px-8 border-b border-velora-border/30 transition-colors ${
        isUser ? 'bg-velora-surface/25' : 'bg-transparent'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header row: Speaker & Actions */}
        <div className="flex items-center justify-between pb-2 mb-2 text-xs font-mono select-none">
          <div className="flex items-center gap-2">
            {isUser ? (
              <span className="text-[11px] font-semibold tracking-wider uppercase text-velora-textMuted">
                You
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-velora-copper inline-block rounded-full" />
                <span className="text-[11px] font-semibold tracking-wide text-velora-text">
                  {node.model || 'Model'}
                </span>
              </div>
            )}

            <span className="text-velora-textMuted/40 text-[10px]">
              {new Date(node.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sibling Branch Indicator (if more than 1 fork) */}
            <BranchConnectorHUD
              currentIndex={siblingInfo.currentIndex}
              total={siblingInfo.total}
              onNavigate={handleBranchNavigation}
            />

            {/* Quick Actions (Copy, Bookmark, Fork) */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 text-velora-textMuted hover:text-velora-text hover:bg-velora-surface rounded-sm transition-colors"
                title="Copy text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-velora-sage" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {!isUser && (
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className={`p-1 rounded-sm transition-colors ${
                    isBookmarked
                      ? 'text-velora-copper bg-velora-copper/10'
                      : 'text-velora-textMuted hover:text-velora-text hover:bg-velora-surface'
                  }`}
                  title={isBookmarked ? 'Edit bookmark note' : 'Bookmark response'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-velora-copper' : ''}`} />
                </button>
              )}

              <button
                onClick={() => onForkTurn(node.id)}
                className="p-1 text-velora-textMuted hover:text-velora-copper hover:bg-velora-surface rounded-sm transition-colors"
                title="Fork alternative branch from here"
              >
                <GitBranch className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="text-[15px] leading-[1.8] font-sans text-velora-text selection:bg-velora-copper selection:text-white">
          {isUser ? (
            <p className="whitespace-pre-wrap font-medium text-velora-text text-[15.5px]">
              {node.content}
            </p>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none text-[15px] leading-[1.8] font-sans">
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
                        className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-velora-surface text-velora-copperLight rounded-sm border border-velora-border/60"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {node.content || (isStreaming ? 'Thinking...' : '')}
              </ReactMarkdown>

              {isStreaming && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-velora-copper animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Bookmarked note annotation preview if present */}
        {!isUser && isBookmarked && bookmarkNote && (
          <div className="mt-2 text-xs text-velora-copper/80 italic font-serif pl-3 border-l-2 border-velora-copper/40">
            Note: "{bookmarkNote}"
          </div>
        )}

        {/* Minimal Answer Controls (Assistant turns, when not actively streaming) */}
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
