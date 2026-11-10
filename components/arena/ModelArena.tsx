import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, Check, ChevronDown, Copy, Swords, Zap } from 'lucide-react';
import { AVAILABLE_MODELS, streamPuterChat } from '@/lib/puter/ai';
import { Button } from '../ui/button';
import { CodeBlock } from '../chat/CodeBlock';

interface ModelArenaProps {
  onAdoptWinner: (modelId: string, content: string, prompt: string) => void;
  onClose: () => void;
}

export const ModelArena: React.FC<ModelArenaProps> = ({ onAdoptWinner, onClose }) => {
  const [modelA, setModelA] = useState(AVAILABLE_MODELS[0].id);
  const [modelB, setModelB] = useState(AVAILABLE_MODELS[1].id);
  const [prompt, setPrompt] = useState('');
  const [responseA, setResponseA] = useState('');
  const [responseB, setResponseB] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [timeA, setTimeA] = useState<number | null>(null);
  const [timeB, setTimeB] = useState<number | null>(null);

  const handleRunDuel = async () => {
    if (!prompt.trim() || isStreaming) return;

    setIsStreaming(true);
    setResponseA('');
    setResponseB('');
    setTimeA(null);
    setTimeB(null);

    const startA = Date.now();
    const startB = Date.now();

    const streamTaskA = streamPuterChat({
      messages: [{ role: 'user', content: prompt.trim() }],
      model: modelA,
      onChunk: (chunk) => setResponseA((prev) => prev + chunk),
    }).then((res) => {
      setTimeA(Date.now() - startA);
      return res;
    });

    const streamTaskB = streamPuterChat({
      messages: [{ role: 'user', content: prompt.trim() }],
      model: modelB,
      onChunk: (chunk) => setResponseB((prev) => prev + chunk),
    }).then((res) => {
      setTimeB(Date.now() - startB);
      return res;
    });

    try {
      await Promise.all([streamTaskA, streamTaskB]);
    } catch (err) {
      console.error('Arena streaming error:', err);
    } finally {
      setIsStreaming(false);
    }
  };

  const getModelObj = (id: string) => AVAILABLE_MODELS.find((m) => m.id === id) || AVAILABLE_MODELS[0];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Arena Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-editorial-charcoal text-editorial-bronze border border-editorial-borderDark rounded-sm">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-foreground tracking-tight flex items-center gap-2">
              Model Arena
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-editorial-bronze/10 text-editorial-bronze border border-editorial-bronze/30 rounded-sm">
                Synchronous Duel
              </span>
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Compare reasoning rigor, speed, and depth side-by-side.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onClose}>
          Exit Arena
        </Button>
      </div>

      {/* Synchronous Comparison Dual Viewport */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/80 overflow-y-auto">
        {/* Model A Viewport */}
        <div className="flex flex-col h-full p-4 md:p-6 bg-card/40">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-editorial-bronze">
                Model A:
              </span>
              <select
                value={modelA}
                onChange={(e) => setModelA(e.target.value)}
                disabled={isStreaming}
                className="bg-muted/50 border border-border text-xs font-mono px-2 py-1 outline-none rounded-sm text-foreground"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            {timeA !== null && (
              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-editorial-bronze" />
                {(timeA / 1000).toFixed(2)}s
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-xs leading-relaxed font-sans min-h-[220px]">
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
                      <code className="px-1 py-0.5 text-xs font-mono bg-muted text-editorial-bronze rounded-sm">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {responseA}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/40 italic font-serif">
                {isStreaming ? 'Streaming response from Model A...' : 'Awaiting prompt dispatch...'}
              </div>
            )}
          </div>

          {responseA && !isStreaming && (
            <div className="pt-3 border-t border-border/60 mt-3 flex justify-end">
              <Button
                variant="editorial"
                size="sm"
                onClick={() => onAdoptWinner(modelA, responseA, prompt)}
                className="flex items-center gap-1.5"
              >
                <span>Adopt Model A as Winner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Model B Viewport */}
        <div className="flex flex-col h-full p-4 md:p-6 bg-card/40">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-editorial-bronze">
                Model B:
              </span>
              <select
                value={modelB}
                onChange={(e) => setModelB(e.target.value)}
                disabled={isStreaming}
                className="bg-muted/50 border border-border text-xs font-mono px-2 py-1 outline-none rounded-sm text-foreground"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            {timeB !== null && (
              <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-editorial-bronze" />
                {(timeB / 1000).toFixed(2)}s
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none text-xs leading-relaxed font-sans min-h-[220px]">
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
                      <code className="px-1 py-0.5 text-xs font-mono bg-muted text-editorial-bronze rounded-sm">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {responseB}
              </ReactMarkdown>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/40 italic font-serif">
                {isStreaming ? 'Streaming response from Model B...' : 'Awaiting prompt dispatch...'}
              </div>
            )}
          </div>

          {responseB && !isStreaming && (
            <div className="pt-3 border-t border-border/60 mt-3 flex justify-end">
              <Button
                variant="editorial"
                size="sm"
                onClick={() => onAdoptWinner(modelB, responseB, prompt)}
                className="flex items-center gap-1.5"
              >
                <span>Adopt Model B as Winner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Unified Prompt Bar */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isStreaming && handleRunDuel()}
            placeholder="Type a benchmark query to test both models simultaneously..."
            disabled={isStreaming}
            className="flex-1 bg-muted/30 border border-border px-4 py-2.5 text-xs font-sans text-foreground placeholder:text-muted-foreground/60 outline-none rounded-sm focus:border-editorial-bronze"
          />
          <Button
            variant="primary"
            onClick={handleRunDuel}
            disabled={isStreaming || !prompt.trim()}
            className="whitespace-nowrap flex items-center gap-2"
          >
            <Swords className="w-3.5 h-3.5 text-editorial-bronze" />
            <span>{isStreaming ? 'Synthesizing...' : 'Dispatch Duel'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

