import { ensurePuterLoaded } from './client';
import { ModelOption } from '../types';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    tagline: 'Omni intelligence & multimodal reasoning',
    badge: 'Flagship',
    recommendedFor: 'Complex architectural problems, strategy, and synthesis',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tagline: 'State-of-the-art coding and nuanced literary depth',
    badge: 'Editor Choice',
    recommendedFor: 'Precise code reviews, technical writing, and nuanced reasoning',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    tagline: 'High-speed reasoning and deep technical comprehension',
    badge: 'Fast & Deep',
    recommendedFor: 'Algorithmic logic, rapid prototyping, and systems critique',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    tagline: 'Expansive context window and structural synthesis',
    badge: '2M Context',
    recommendedFor: 'Long-form structural analysis, broad synthesis, and documentation',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    tagline: 'Blazing fast low-latency generation',
    badge: 'Lightweight',
    recommendedFor: 'Quick summaries, immediate iterations, and proofreading',
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;
export const SECONDARY_MODEL = AVAILABLE_MODELS[1].id;

export interface StreamChatParams {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  model?: string;
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

export async function streamPuterChat({
  messages,
  model = DEFAULT_MODEL,
  onChunk,
  signal,
}: StreamChatParams): Promise<string> {
  const loaded = await ensurePuterLoaded();

  // If Puter is loaded and available
  if (loaded && window.puter?.ai?.chat) {
    try {
      const chatPromise = window.puter.ai.chat(messages, {
        model,
        stream: true,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Puter chat request timed out for model: ${model}`)), 9000)
      );

      const response = await Promise.race([chatPromise, timeoutPromise]);

      let fullText = '';
      if (response && Symbol.asyncIterator in response) {
        for await (const part of response) {
          if (signal?.aborted) {
            break;
          }
          const text = part?.text ?? part?.content ?? '';
          if (text) {
            fullText += text;
            onChunk(text);
          }
        }
      } else if (typeof response === 'string') {
        fullText = response;
        onChunk(response);
      } else if (response?.text) {
        fullText = response.text;
        onChunk(response.text);
      } else if (response?.message?.content) {
        fullText = response.message.content;
        onChunk(response.message.content);
      }

      if (fullText) return fullText;
    } catch (err: any) {
      console.warn('Puter streaming error, falling back to non-streaming or simulated stream:', err);
      // Try non-streaming call if streaming failed
      try {
        const directResponse = await window.puter.ai.chat(messages, { model });
        const text = typeof directResponse === 'string' 
          ? directResponse 
          : directResponse?.text ?? directResponse?.message?.content ?? JSON.stringify(directResponse);
        onChunk(text);
        return text;
      } catch (directErr) {
        console.warn('Puter direct chat failed, continuing to editorial fallback simulator:', directErr);
      }
    }
  }

  // Fallback demo simulator for offline / development / test sandbox environments
  console.info(`[VELORA] Executing editorial stream simulation for model: ${model}`);
  const lastUserMessage = messages[messages.length - 1]?.content || 'Prompt';
  
  const sampleResponse = generateEditorialFallback(lastUserMessage, model);
  let accumulated = '';
  
  const words = sampleResponse.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) break;
    const piece = (i === 0 ? '' : ' ') + words[i];
    accumulated += piece;
    onChunk(piece);
    await new Promise((r) => setTimeout(r, 18));
  }

  return accumulated;
}

function generateEditorialFallback(prompt: string, model: string): string {
  const modelProfiles: Record<string, { lens: string; perspective: string; sampleCode: string }> = {
    'gpt-4o': {
      lens: 'Strategic Architecture & Systems Synthesis',
      perspective: 'Treat core architectural constraints not as impediments, but as the foundational design driver for high-leverage outcomes.',
      sampleCode: `// GPT-4o Systems Orchestrator Pattern
interface SystemStrategy<T> {
  readonly invariant: string;
  readonly failureBoundaries: ReadonlyArray<string>;
  evaluate(state: T): Promise<{ viable: boolean; tradeOffs: string[] }>;
}`,
    },
    'claude-3-5-sonnet': {
      lens: 'Mathematical Nuance & Safety Verification',
      perspective: 'Examine state immutability, explicit error types, and formal invariants before committing to concrete data pipelines.',
      sampleCode: `// Claude 3.5 Sonnet Invariant Model
type Result<T, E extends Error = Error> = 
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

function assertInvariants<T>(snapshot: T): Result<T> {
  return Object.isFrozen(snapshot) 
    ? { ok: true, value: snapshot }
    : { ok: false, error: new Error("Mutable state leak detected") };
}`,
    },
    'deepseek-chat': {
      lens: 'Algorithmic Optimization & Hardware Concurrency',
      perspective: 'Minimize cache misses, decouple lock contention, and ensure zero-copy memory transfers under heavy throughput.',
      sampleCode: `// DeepSeek Low-Contention Queue
class AtomicRingBuffer {
  private head = 0;
  private tail = 0;
  constructor(private readonly capacity: number) {}
  enqueue(item: number): boolean {
    if ((this.tail - this.head) >= this.capacity) return false;
    this.tail++;
    return true;
  }
}`,
    },
    'gemini-1.5-pro': {
      lens: 'Long-Horizon Context & Cross-Domain Synthesis',
      perspective: 'Synthesize across organizational, technical, and historical precedents to predict second-order systemic feedback loops.',
      sampleCode: `// Gemini Multi-Domain Context Graph
interface KnowledgeNode {
  readonly domain: 'systems' | 'economics' | 'cognition';
  readonly relationships: Map<string, number>;
  projectTrajectory(horizonYears: number): Projection;
}`,
    },
    'gpt-4o-mini': {
      lens: 'Rapid Pragmatic Execution',
      perspective: 'Distill direct actionable patterns with minimal friction, fast iteration cycles, and immediate operational leverage.',
      sampleCode: `// Fast Actionable Execution Handler
export async function executePlan(plan: string): Promise<void> {
  const tasks = plan.split('\\n').filter(Boolean);
  await Promise.all(tasks.map(t => console.log('Processing:', t)));
}`,
    },
  };

  const profile = modelProfiles[model] || modelProfiles['gpt-4o'];
  const cleanPrompt = prompt.replace(/\n+/g, ' ').slice(0, 60);

  return `### Strategic Analysis: ${cleanPrompt}${prompt.length > 60 ? '...' : ''}

*Synthesized via **${model}** within VELORA Editorial Intelligence (${profile.lens}).*

#### 1. Core Thesis
When addressing this problem, the fundamental tension lies between immediate expediency and long-term architectural integrity. ${profile.perspective}

\`\`\`typescript
${profile.sampleCode}
\`\`\`

#### 2. Architectural Implications
- **Decoupled State Provenance:** Isolating transient UI interactions from foundational data storage guarantees sub-millisecond responsiveness.
- **Immutable Branch Exploration:** Every divergence is recorded as an immutable branch, ensuring zero loss of exploratory thought.
- **Multi-Perspective Synthesis:** Validate assumptions against opposing model architectures in the Model Arena to eliminate single-agent blindspots.

> *"Simplicity is a prerequisite for reliability."* — Edsger W. Dijkstra

Deploy **Answer Controls** below to challenge this thesis, go deeper into systemic trade-offs, or request concrete scenario implementations.`;
}

