import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, Check, ChevronDown, Copy, Swords, Zap, X } from 'lucide-react';
import { AVAILABLE_MODELS, streamPuterChat } from '@/lib/puter/ai';
import { CodeBlock } from '../chat/CodeBlock';
import { animateArenaReveal } from '@/lib/gsap/gsap-interactions';

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

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateArenaReveal(leftPanelRef.current, rightPanelRef.current);
  }, []);

  const handleRunDuel = async () => {
    if (!prompt.trim() || isStreaming) return;

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
      onChunk: (chunk) => setResponseA((prev) => prev + chunk),
    }).then((res) => {
      setTimeA(Date.now() - startA);
      return res;
    });

    const taskB = streamPuterChat({
      messages: [{ role: 'user', content: prompt.trim() }],
      model: modelB,
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
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-velora-border bg-velora-surface">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-velora-elevated text-velora-copper border border-velora-border rounded-xs">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-velora-text tracking-tight flex items-center gap-2">
              Model Arena
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-velora-copper/10 text-velora-copper border border-velora-copper/30 rounded-xs">
                Synchronous Benchmark
              </span>
            </h2>
            <p className="text-xs text-velora-textMuted font-sans">
              Compare speed, reasoning architecture, and synthesis side-by-side.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated border border-velora-border rounded-xs transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Arena</span>
        </button>
      </div>

      {/* Dual Split Panels */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-velora-border overflow-y-auto">
        {/* Model A Viewport */}
        <div ref={leftPanelRef} className="flex flex-col h-full p-5 md:p-7 bg-velora-surface/30">
          <div className="flex items-center justify-between pb-3.5 border-b border-velora-border mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-velora-copper">
                Model A:
              </span>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                disabled={isStreaming}
                className="bg-velora-elevated border border-velora-border text-xs font-mono px-2.5 py-1 outline-none rounded-xs text-velora-text"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
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

          <div className="flex-1 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-[14px] leading-relaxed font-sans min-h-[240px] select-text">
            {responseA ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    if (!inline && match) {
                      return <CodeBlock language={match[1]} value={codeString} />;
                    }
                    if (!inline) return <CodeBlock value={codeString} />;
                    return (
                      <code className="px-1 py-0.5 text-xs font-mono bg-velora-elevated text-velora-copperLight rounded-xs border border-velora-border">
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
            <div className="pt-3.5 border-t border-velora-border mt-3 flex justify-end">
              <button
                onClick={() => onAdoptWinner(modelA, responseA, prompt)}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono bg-velora-copper hover:bg-velora-copperLight text-white rounded-xs transition-colors shadow-sm"
              >
                <span>Adopt Model A as Winner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Model B Viewport */}
        <div ref={rightPanelRef} className="flex flex-col h-full p-5 md:p-7 bg-velora-surface/30">
          <div className="flex items-center justify-between pb-3.5 border-b border-velora-border mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-velora-copper">
                Model B:
              </span>
              <select
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
                disabled={isStreaming}
                className="bg-velora-elevated border border-velora-border text-xs font-mono px-2.5 py-1 outline-none rounded-xs text-velora-text"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
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

          <div className="flex-1 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-[14px] leading-relaxed font-sans min-h-[240px] select-text">
            {responseB ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    if (!inline && match) {
                      return <CodeBlock language={match[1]} value={codeString} />;
                    }
                    if (!inline) return <CodeBlock value={codeString} />;
                    return (
                      <code className="px-1 py-0.5 text-xs font-mono bg-velora-elevated text-velora-copperLight rounded-xs border border-velora-border">
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
            <div className="pt-3.5 border-t border-velora-border mt-3 flex justify-end">
              <button
                onClick={() => onAdoptWinner(modelB, responseB, prompt)}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono bg-velora-copper hover:bg-velora-copperLight text-white rounded-xs transition-colors shadow-sm"
              >
                <span>Adopt Model B as Winner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Unified Benchmark Command Bar */}
      <div className="p-4 border-t border-velora-border bg-velora-surface">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isStreaming && handleRunDuel()}
            placeholder="Type a benchmark query to test both models simultaneously..."
            disabled={isStreaming}
            className="flex-1 bg-velora-elevated border border-velora-border px-4 py-2.5 text-xs font-sans text-velora-text placeholder:text-velora-textMuted/50 outline-none rounded-xs focus:border-velora-copper"
          />
          <button
            onClick={handleRunDuel}
            disabled={isStreaming || !prompt.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-velora-copper hover:bg-velora-copperLight active:scale-[0.98] text-white text-xs font-mono font-medium rounded-xs disabled:opacity-40 transition-all shadow-sm whitespace-nowrap"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>{isStreaming ? 'Benchmarking...' : 'Dispatch Duel'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

