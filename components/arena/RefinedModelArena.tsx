import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowRight, Check, ChevronDown, Copy, Square, Swords, Zap, X } from 'lucide-react';
import { AVAILABLE_MODELS, streamPuterChat } from '@/lib/puter/ai';
import { CodeBlock } from '../chat/CodeBlock';
import { animateArenaReveal } from '@/lib/gsap/gsap-interactions';
import { MagneticButton } from '../ui/MagneticButton';

interface RefinedModelArenaProps {
  onAdoptWinner: (modelId: string, content: string, prompt: string) => void;
  onClose: () => void;
}

export const RefinedModelArena: React.FC<RefinedModelArenaProps> = ({ onAdoptWinner, onClose }) => {
  const [modelA, setModelA] = useState(AVAILABLE_MODELS[0].id);
  const [modelB, setModelB] = useState(AVAILABLE_MODELS[1].id);
  const [prompt, setPrompt] = useState('');
  const [responseA, setResponseA] = useState('');
  const [responseB, setResponseB] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [timeA, setTimeA] = useState<number | null>(null);
  const [timeB, setTimeB] = useState<number | null>(null);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    animateArenaReveal(leftPanelRef.current, rightPanelRef.current);
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleStopDuel = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const handleRunDuel = async () => {
    if (!prompt.trim() || isStreaming) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsStreaming(true);
    setResponseA('');
    setResponseB('');
    setTimeA(null);
    setTimeB(null);

    const startA = Date.now();
    const startB = Date.now();

    const taskA = streamPuterChat({
      messages: [{ role: 'user', content: prompt.trim() }],
      model: modelA,
      signal: ac.signal,
      onChunk: (chunk) => setResponseA((prev) => prev + chunk),
    }).then((res) => {
      setTimeA(Date.now() - startA);
      return res;
    });

    const taskB = streamPuterChat({
      messages: [{ role: 'user', content: prompt.trim() }],
      model: modelB,
      signal: ac.signal,
      onChunk: (chunk) => setResponseB((prev) => prev + chunk),
    }).then((res) => {
      setTimeB(Date.now() - startB);
      return res;
    });

    try {
      await Promise.all([taskA, taskB]);
    } catch (err) {
      console.error('Arena streaming error:', err);
    } finally {
      setIsStreaming(false);
    }
  };

  const modelAObj = AVAILABLE_MODELS.find((m) => m.id === modelA) || AVAILABLE_MODELS[0];
  const modelBObj = AVAILABLE_MODELS.find((m) => m.id === modelB) || AVAILABLE_MODELS[1];

  return (
    <div className="flex flex-col h-full bg-velora-bg overflow-hidden select-none">
      {/* Arena Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.05] bg-[#0A0B0E]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-white/[0.04] text-velora-copper rounded-xl">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-velora-text tracking-tight flex items-center gap-2">
              Model Arena
              <span className="text-[10px] font-mono px-2 py-0.5 bg-velora-copper/10 text-velora-copper rounded-full">
                Benchmark
              </span>
            </h2>
            <p className="text-xs text-velora-textMuted font-sans">
              Compare speed, reasoning architecture, and synthesis side-by-side.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            abortRef.current?.abort();
            onClose();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Arena</span>
        </button>
      </div>

      {/* Dual Split Panels */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.05] overflow-y-auto">
        {/* Model A Viewport */}
        <div ref={leftPanelRef} className="flex flex-col h-full p-5 md:p-7 bg-[#090A0C]">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.05] mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-velora-copper">
                Model A:
              </span>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                disabled={isStreaming}
                className="bg-white/[0.04] border border-white/10 text-xs font-sans px-3 py-1 outline-none rounded-full text-velora-text"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#14161A] text-white">
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            {timeA !== null && (
              <span className="text-[11px] font-mono text-velora-sage flex items-center gap-1">
                <Zap className="w-3 h-3 text-velora-sage" />
                {(timeA / 1000).toFixed(2)}s
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-[14.5px] leading-relaxed font-sans min-h-[240px] select-text">
            {responseA ? (
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
                      <code className="px-1.5 py-0.5 text-xs font-mono bg-white/[0.06] text-velora-copperLight rounded-md" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {responseA}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center text-velora-textMuted/40 italic font-serif">
                {isStreaming ? 'Synthesizing response from Model A...' : 'Awaiting prompt dispatch...'}
              </div>
            )}
          </div>

          {responseA && !isStreaming && (
            <div className="pt-3.5 border-t border-white/[0.05] mt-3 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(responseA);
                  setCopiedA(true);
                  setTimeout(() => setCopiedA(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-colors"
                title="Copy Model A response"
              >
                {copiedA ? <Check className="w-3.5 h-3.5 text-velora-sage" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedA ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => onAdoptWinner(modelA, responseA, prompt)}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium bg-velora-copper hover:bg-velora-copperLight text-white rounded-full transition-all shadow-sm active:scale-95"
              >
                <span>Adopt Model A</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Model B Viewport */}
        <div ref={rightPanelRef} className="flex flex-col h-full p-5 md:p-7 bg-[#090A0C]">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.05] mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-velora-copper">
                Model B:
              </span>
              <select
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
                disabled={isStreaming}
                className="bg-white/[0.04] border border-white/10 text-xs font-sans px-3 py-1 outline-none rounded-full text-velora-text"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#14161A] text-white">
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            {timeB !== null && (
              <span className="text-[11px] font-mono text-velora-sage flex items-center gap-1">
                <Zap className="w-3 h-3 text-velora-sage" />
                {(timeB / 1000).toFixed(2)}s
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-[14.5px] leading-relaxed font-sans min-h-[240px] select-text">
            {responseB ? (
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
                      <code className="px-1.5 py-0.5 text-xs font-mono bg-white/[0.06] text-velora-copperLight rounded-md" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {responseB}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center text-velora-textMuted/40 italic font-serif">
                {isStreaming ? 'Synthesizing response from Model B...' : 'Awaiting prompt dispatch...'}
              </div>
            )}
          </div>

          {responseB && !isStreaming && (
            <div className="pt-3.5 border-t border-white/[0.05] mt-3 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(responseB);
                  setCopiedB(true);
                  setTimeout(() => setCopiedB(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-velora-textMuted hover:text-velora-text bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-colors"
                title="Copy Model B response"
              >
                {copiedB ? <Check className="w-3.5 h-3.5 text-velora-sage" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedB ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => onAdoptWinner(modelB, responseB, prompt)}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium bg-velora-copper hover:bg-velora-copperLight text-white rounded-full transition-all shadow-sm active:scale-95"
              >
                <span>Adopt Model B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Unified Benchmark Command Bar */}
      <div className="p-4 border-t border-white/[0.05] bg-[#0A0B0E]">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isStreaming && handleRunDuel()}
            placeholder="Type a benchmark query to test both models simultaneously..."
            disabled={isStreaming}
            className="flex-1 bg-white/[0.03] border border-white/10 px-4 py-2.5 text-xs font-sans text-velora-text placeholder:text-velora-textMuted/40 outline-none rounded-xl focus:border-velora-copper/50"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopDuel}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-medium rounded-full transition-all active:scale-[0.98] whitespace-nowrap shadow-sm"
              title="Stop benchmark duel"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Benchmark</span>
            </button>
          ) : (
            <MagneticButton
              type="button"
              onClick={handleRunDuel}
              disabled={!prompt.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-velora-copper hover:bg-velora-copperLight active:scale-[0.98] text-white text-xs font-medium rounded-full disabled:opacity-30 transition-all shadow-sm whitespace-nowrap"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Dispatch Duel</span>
            </MagneticButton>
          )}
        </div>
      </div>
    </div>
  );
};

