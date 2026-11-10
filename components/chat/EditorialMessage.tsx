import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  Bookmark,
  Check,
  Copy,
  GitBranch,
  RotateCcw,
} from 'lucide-react';
import { MessageNode, AnswerControlAction } from '@/lib/types';
import { CodeBlock } from './CodeBlock';
import { BranchConnectorHUD } from './BranchConnectorHUD';
import { RefinedAnswerControls } from './RefinedAnswerControls';
import { BookmarkNoteModal } from '../bookmarks/BookmarkNoteModal';
import { animateMessageEntrance } from '@/lib/gsap/gsap-interactions';

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
  onRegenerate?: (nodeId: string) => void;
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
  onRegenerate,
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

  // 1. User Message (Clean, fluid right-aligned chat bubble, NO boxy wireframes)
  if (isUser) {
    return (
      <div
        id={`msg-${node.id}`}
        ref={containerRef}
        className="py-4 px-4 sm:px-6 max-w-3xl mx-auto flex justify-end group scroll-mt-20"
      >
        <div className="flex flex-col items-end max-w-xl">
          {/* Branch switcher if alternative user turns exist */}
          {siblingInfo.total > 1 && (
            <div className="mb-1.5 flex items-center justify-end">
              <BranchConnectorHUD
                currentIndex={siblingInfo.currentIndex}
                total={siblingInfo.total}
                onNavigate={onNavigateBranch}
              />
            </div>
          )}

          <div className="bg-[#1C1F26] text-velora-text text-[15px] leading-relaxed px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm select-text">
            <p className="whitespace-pre-wrap">{node.content}</p>
          </div>

          <div className="flex items-center gap-2 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono text-velora-textMuted/60 select-none">
            <button
              onClick={handleCopy}
              className="hover:text-velora-text transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-velora-sage" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => onForkTurn(node.id)}
              className="hover:text-velora-copper transition-colors flex items-center gap-1"
            >
              <GitBranch className="w-3 h-3" />
              <span>Fork</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Assistant Message (Flowing editorial prose, NO boxes, NO heavy borders)
  return (
    <div
      id={`msg-${node.id}`}
      ref={containerRef}
      className="py-6 px-4 sm:px-6 max-w-3xl mx-auto group scroll-mt-20"
    >
      {/* Header bar: Model tag & Fork switcher */}
      <div className="flex items-center justify-between pb-2 mb-3 text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-velora-text text-[13px]">
            <span className="w-2 h-2 rounded-full bg-velora-copper inline-block" />
            <span>{node.model || 'VELORA'}</span>
          </div>

          <span className="text-velora-textMuted/40 text-[11px] font-mono">
            {new Date(node.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Sibling navigation if branched */}
        <BranchConnectorHUD
          currentIndex={siblingInfo.currentIndex}
          total={siblingInfo.total}
          onNavigate={onNavigateBranch}
        />
      </div>

      {/* Main Prose Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none text-[15.5px] leading-[1.8] font-sans text-velora-text prose-p:my-3 prose-headings:font-serif prose-headings:text-velora-text prose-h3:text-lg prose-h3:font-normal prose-h3:mt-6 prose-h3:mb-2 prose-ul:my-2 prose-li:my-1 prose-hr:border-white/[0.08] selection:bg-velora-copper/30">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre({ children }: any) {
              return <div className="not-prose">{children}</div>;
            },
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              if (!inline && match) {
                return (
                  <CodeBlock language={match[1]}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </CodeBlock>
                );
              }
              if (!inline) {
                return (
                  <CodeBlock>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </CodeBlock>
                );
              }
              return (
                <code
                  className="px-1.5 py-0.5 mx-0.5 text-xs font-mono bg-white/[0.06] text-velora-copperLight rounded-md"
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
          <span className="inline-block w-1.5 h-4 ml-1 bg-velora-copper animate-pulse align-middle rounded-full" />
        )}
      </div>

      {/* Bookmark annotation display if present */}
      {isBookmarked && bookmarkNote && (
        <div className="mt-3 text-xs text-velora-copper/90 italic font-serif pl-3 border-l-2 border-velora-copper/40">
          Note: "{bookmarkNote}"
        </div>
      )}

      {/* Modern Aceternity-inspired answer refinement pills */}
      {!isStreaming && node.content && (
        <RefinedAnswerControls onSelectAction={onAnswerControl} />
      )}

      {/* Subtle action controls on hover */}
      <div className="flex items-center gap-2 mt-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-velora-textMuted select-none">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 text-xs hover:text-velora-text bg-white/[0.02] hover:bg-white/[0.06] rounded-full transition-colors"
          title="Copy response"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-velora-sage" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          onClick={() => setIsNoteModalOpen(true)}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full transition-colors ${
            isBookmarked
              ? 'text-velora-copper bg-velora-copper/10'
              : 'hover:text-velora-text bg-white/[0.02] hover:bg-white/[0.06]'
          }`}
          title={isBookmarked ? 'Edit bookmark note' : 'Bookmark response'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-velora-copper' : ''}`} />
          <span className="text-[11px]">{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>

        <button
          onClick={() => onForkTurn(node.id)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs hover:text-velora-copper bg-white/[0.02] hover:bg-white/[0.06] rounded-full transition-colors"
          title="Fork alternative branch from here"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span className="text-[11px]">Fork Branch</span>
        </button>

        {onRegenerate && (
          <button
            onClick={() => onRegenerate(node.id)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs hover:text-velora-copper bg-white/[0.02] hover:bg-white/[0.06] rounded-full transition-colors"
            title="Generate alternative response with active model"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Regenerate</span>
          </button>
        )}
      </div>

      {/* Bookmark note editing dialog */}
      <BookmarkNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={(note) => {
          onToggleBookmark(node.id, node.content, node.model || 'AI Model', note);
        }}
        onRemove={() => {
          onToggleBookmark(node.id, node.content, node.model || 'AI Model', undefined);
        }}
        initialNote={bookmarkNote}
        isBookmarked={isBookmarked}
      />
    </div>
  );
};
