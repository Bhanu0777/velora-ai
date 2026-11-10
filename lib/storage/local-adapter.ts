import { ConversationTree, Bookmark, PromptTemplate } from '../types';
import { INITIAL_PROMPT_VAULT } from '../prompts/default-vault';
import {
  saveConversationsToPuter,
  loadConversationsFromPuter,
  saveBookmarksToPuter,
  loadBookmarksFromPuter,
  saveVaultToPuter,
  loadVaultFromPuter,
} from '../puter/kv';

const STORAGE_KEYS = {
  CONVERSATIONS: 'velora_local_conversations',
  ACTIVE_CONV: 'velora_local_active_conv',
  BOOKMARKS: 'velora_local_bookmarks',
  VAULT: 'velora_local_vault',
  THEME: 'velora_local_theme',
};

// Safe JSON parse helper
function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to parse localStorage key ${key}:`, err);
    return fallback;
  }
}

function safeSet(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write localStorage key ${key}:`, err);
  }
}

export function getLocalConversations(): Record<string, ConversationTree> {
  return safeParse<Record<string, ConversationTree>>(STORAGE_KEYS.CONVERSATIONS, {});
}

export function saveLocalConversations(convs: Record<string, ConversationTree>): void {
  safeSet(STORAGE_KEYS.CONVERSATIONS, convs);
  // Async background sync to Puter KV if connected
  saveConversationsToPuter(convs).catch(() => {});
}

export function getActiveConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONV);
}

export function setActiveConversationId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (!id) {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONV);
  } else {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONV, id);
  }
}

export function getLocalBookmarks(): Bookmark[] {
  return safeParse<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
}

export function saveLocalBookmarks(bookmarks: Bookmark[]): void {
  safeSet(STORAGE_KEYS.BOOKMARKS, bookmarks);
  saveBookmarksToPuter(bookmarks).catch(() => {});
}

export function getLocalVault(): PromptTemplate[] {
  const existing = safeParse<PromptTemplate[]>(STORAGE_KEYS.VAULT, []);
  if (!existing || existing.length === 0) {
    safeSet(STORAGE_KEYS.VAULT, INITIAL_PROMPT_VAULT);
    return INITIAL_PROMPT_VAULT;
  }
  return existing;
}

export function saveLocalVault(vault: PromptTemplate[]): void {
  safeSet(STORAGE_KEYS.VAULT, vault);
  saveVaultToPuter(vault).catch(() => {});
}

/**
 * Merges local and Puter cloud records when a user signs in
 */
export async function syncLocalWithPuterCloud(): Promise<{
  conversations: Record<string, ConversationTree>;
  bookmarks: Bookmark[];
  vault: PromptTemplate[];
}> {
  const localConvs = getLocalConversations();
  const localBookmarks = getLocalBookmarks();
  const localVault = getLocalVault();

  try {
    const [cloudConvs, cloudBookmarks, cloudVault] = await Promise.all([
      loadConversationsFromPuter(),
      loadBookmarksFromPuter(),
      loadVaultFromPuter(),
    ]);

    // Merge conversations (prefer newer updatedAt)
    const mergedConvs: Record<string, ConversationTree> = { ...localConvs };
    if (cloudConvs) {
      for (const [id, tree] of Object.entries(cloudConvs)) {
        if (!mergedConvs[id] || tree.updatedAt > mergedConvs[id].updatedAt) {
          mergedConvs[id] = tree;
        }
      }
    }

    // Merge bookmarks by ID
    const bookmarkMap = new Map<string, Bookmark>();
    localBookmarks.forEach((b) => bookmarkMap.set(b.id, b));
    if (cloudBookmarks) {
      cloudBookmarks.forEach((b) => bookmarkMap.set(b.id, b));
    }
    const mergedBookmarks = Array.from(bookmarkMap.values());

    // Merge prompt vault by ID
    const vaultMap = new Map<string, PromptTemplate>();
    localVault.forEach((v) => vaultMap.set(v.id, v));
    if (cloudVault) {
      cloudVault.forEach((v) => vaultMap.set(v.id, v));
    }
    const mergedVault = Array.from(vaultMap.values());

    // Save unified state locally and push back to cloud
    safeSet(STORAGE_KEYS.CONVERSATIONS, mergedConvs);
    safeSet(STORAGE_KEYS.BOOKMARKS, mergedBookmarks);
    safeSet(STORAGE_KEYS.VAULT, mergedVault);

    await Promise.all([
      saveConversationsToPuter(mergedConvs),
      saveBookmarksToPuter(mergedBookmarks),
      saveVaultToPuter(mergedVault),
    ]);

    return {
      conversations: mergedConvs,
      bookmarks: mergedBookmarks,
      vault: mergedVault,
    };
  } catch (err) {
    console.error('Cloud sync encountered an error:', err);
    return {
      conversations: localConvs,
      bookmarks: localBookmarks,
      vault: localVault,
    };
  }
}
