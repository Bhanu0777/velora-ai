import { ensurePuterLoaded } from './client';
import { ConversationTree, Bookmark, PromptTemplate } from '../types';

const KV_KEYS = {
  CONVERSATIONS: 'velora_v1_conversations',
  BOOKMARKS: 'velora_v1_bookmarks',
  VAULT: 'velora_v1_vault',
  SETTINGS: 'velora_v1_settings',
};

export async function saveConversationsToPuter(conversations: Record<string, ConversationTree>): Promise<boolean> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.kv) return false;
  try {
    if (!window.puter.auth?.isSignedIn?.()) return false;
    await window.puter.kv.set(KV_KEYS.CONVERSATIONS, conversations);
    return true;
  } catch (err) {
    console.error('Failed to save conversations to Puter KV:', err);
    return false;
  }
}

export async function loadConversationsFromPuter(): Promise<Record<string, ConversationTree> | null> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.kv) return null;
  try {
    if (!window.puter.auth?.isSignedIn?.()) return null;
    const data = await window.puter.kv.get(KV_KEYS.CONVERSATIONS);
    return data || null;
  } catch (err) {
    console.error('Failed to load conversations from Puter KV:', err);
    return null;
  }
}

export async function saveBookmarksToPuter(bookmarks: Bookmark[]): Promise<boolean> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.kv) return false;
  try {
    if (!window.puter.auth?.isSignedIn?.()) return false;
    await window.puter.kv.set(KV_KEYS.BOOKMARKS, bookmarks);
    return true;
  } catch (err) {
    console.error('Failed to save bookmarks to Puter KV:', err);
    return false;
  }
}

export async function loadBookmarksFromPuter(): Promise<Bookmark[] | null> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.kv) return null;
  try {
    if (!window.puter.auth?.isSignedIn?.()) return null;
    const data = await window.puter.kv.get(KV_KEYS.BOOKMARKS);
    return data || null;
  } catch (err) {
    console.error('Failed to load bookmarks from Puter KV:', err);
    return null;
  }
}

export async function saveVaultToPuter(vault: PromptTemplate[]): Promise<boolean> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.kv) return false;
  try {
    if (!window.puter.auth?.isSignedIn?.()) return false;
    await window.puter.kv.set(KV_KEYS.VAULT, vault);
    return true;
  } catch (err) {
    console.error('Failed to save vault to Puter KV:', err);
    return false;
  }
}

export async function loadVaultFromPuter(): Promise<PromptTemplate[] | null> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.kv) return null;
  try {
    if (!window.puter.auth?.isSignedIn?.()) return null;
    const data = await window.puter.kv.get(KV_KEYS.VAULT);
    return data || null;
  } catch (err) {
    console.error('Failed to load vault from Puter KV:', err);
    return null;
  }
}
