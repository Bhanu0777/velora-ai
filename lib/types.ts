export interface MessageNode {
  id: string;
  parentId: string | null;
  childIds: string[];
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  createdAt: number;
  tokens?: number;
}

export interface ConversationTree {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isFavorite: boolean;
  activeLeafId: string;
  nodes: Record<string, MessageNode>;
}

export interface Bookmark {
  id: string;
  conversationId: string;
  messageId: string;
  content: string;
  model: string;
  note?: string;
  createdAt: number;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description?: string;
  category: 'Strategy' | 'Code' | 'Writing' | 'Analysis' | 'Systems';
  prompt: string;
  variables: string[];
  createdAt: number;
  isCustom?: boolean;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  tagline: string;
  badge?: string;
  recommendedFor: string;
}

export interface PuterUser {
  username: string;
  uuid?: string;
  email?: string;
}

export type AnswerControlAction = 
  | 'explain-simply'
  | 'give-examples'
  | 'summarize'
  | 'go-deeper'
  | 'challenge';

