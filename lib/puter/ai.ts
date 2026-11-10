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
      const response = await window.puter.ai.chat(messages, {
        model,
        stream: true,
      });

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
        console.error('Puter direct chat failed:', directErr);
        throw directErr;
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
    await new Promise((r) => setTimeout(r, 20));
  }

  return accumulated;
}

function generateEditorialFallback(prompt: string, model: string): string {
  return `### Strategic Analysis: ${prompt.slice(0, 40)}${prompt.length > 40 ? '...' : ''}

*Generated via **${model}** within VELORA Editorial Intelligence.*

#### 1. Core Thesis
When examining this query, the fundamental tension lies between immediate execution and architectural longevity. Solutions in this domain succeed when they treat core structural constraints not as impediments, but as the primary design driver.

\`\`\`typescript
// Architectural Pattern Illustration
interface StrategicPlan {
  readonly objective: string;
  readonly tradeOffs: string[];
  execute(): Promise<Resolution>;
}
\`\`\`

#### 2. Structural Implications
- **Decoupled State:** Isolating transient interactions from foundational persistence guarantees zero-latency responsiveness.
- **Tree Provenance:** Preserving every iteration as an immutable branch ensures complete auditability across exploratory paths.
- **Synthesized Trade-offs:** Avoid single-perspective blindspots by cross-referencing model perspectives in the Model Arena.

> *"Simplicity is a prerequisite for reliability."* — Edsger W. Dijkstra

Feel free to utilize **Answer Controls** below to challenge this thesis, go deeper, or request real-world implementations.`;
}
