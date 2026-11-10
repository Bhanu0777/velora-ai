import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bookmark, Check, Copy, GitBranch, RefreshCw } from 'lucide-react';
import { MessageNode, AnswerControlAction } from '@/lib/types';
import { CodeBlock } from './CodeBlock';
import { BranchNavigator } from './BranchNavigator';
import { AnswerControls } from './AnswerControls';
import { BookmarkNoteModal } from '../bookmarks/BookmarkNoteModal';

interface MessageTurnProps {
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

export const MessageTurn: React.FC<MessageTurnProps> = ({
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
  const [copied, setCopied] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

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
      className={`group relative py-6 px-4 md:px-8 border-b border-border/40 transition-colors ${
        isUser ? 'bg-muted/15' : 'bg-transparent'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Turn Header */}
        <div className="flex items-center justify-between pb-2 mb-2 text-[11px] font-mono select-none">
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-sm ${
                isUser
                  ? 'bg-foreground text-background text-[10px]'
                  : 'bg-editorial-charcoal text-editorial-bronzeLight border border-editorial-borderDark text-[10px]'
              }`}
            >
              {isUser ? 'Prompt' : node.model || 'Model Reflection'}
            </span>

            {/* Timestamp */}
            <span className="text-muted-foreground/60 text-[10px]">
              {new Date(node.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Sibling Branch Indicator (if more than 1 fork) */}
          <BranchNavigator
            currentIndex={siblingInfo.currentIndex}
            total={siblingInfo.total}
            onNavigate={onNavigateBranch}
          />
        </div>

        {/* Turn Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-[14.5px] leading-relaxed font-sans">
          {isUser ? (
            <p className="whitespace-pre-wrap text-foreground font-medium selection:bg-editorial-bronze">
              {node.content}
            </p>
          ) : (
            <div className="markdown-content">
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
                        className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-muted/60 text-editorial-bronze rounded-sm border border-border/50"
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
                <span className="inline-block w-2 h-4 ml-1 bg-editorial-bronze animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Action Controls for Turn */}
        <div className="flex items-center justify-between pt-3 mt-2 text-[11px] font-mono text-muted-foreground border-t border-border/20 opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-1 hover:text-foreground hover:bg-muted/40 rounded-sm transition-colors"
              title="Copy text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Bookmark button (for assistant turn) */}
            {!isUser && (
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm transition-colors ${
                  isBookmarked
                    ? 'text-editorial-bronze bg-editorial-bronze/10 border border-editorial-bronze/30 font-medium'
                    : 'hover:text-foreground hover:bg-muted/40'
                }`}
                title={isBookmarked ? 'Edit bookmark note' : 'Save bookmark'}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            )}

            {/* Fork turn */}
            <button
              onClick={() => onForkTurn(node.id)}
              className="inline-flex items-center gap-1 px-2 py-1 hover:text-foreground hover:bg-muted/40 rounded-sm transition-colors"
              title="Branch from this exact turn"
            >
              <GitBranch className="w-3.5 h-3.5 text-editorial-bronze" />
              <span>Fork Branch</span>
            </button>
          </div>

          {/* Bookmarked personal note preview */}
          {!isUser && isBookmarked && bookmarkNote && (
            <div className="text-[11px] text-editorial-bronze/90 italic truncate max-w-xs font-serif pl-2 border-l border-border/60">
              Note: "{bookmarkNote}"
            </div>
          )}
        </div>

        {/* Answer Controls for Assistant turns (when not actively streaming) */}
        {!isUser && !isStreaming && node.content && (
          <AnswerControls onSelectAction={onAnswerControl} />
        )}

        {/* Note editing dialog */}
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

