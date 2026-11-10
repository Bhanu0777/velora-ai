'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ConversationTree,
  Bookmark,
  PromptTemplate,
  PuterUser,
  AnswerControlAction,
} from '@/lib/types';
import {
  DEFAULT_MODEL,
  AVAILABLE_MODELS,
  streamPuterChat,
} from '@/lib/puter/ai';
import {
  getPuterUser,
  signInWithPuter,
  signOutPuter,
} from '@/lib/puter/auth';
import {
  getLocalConversations,
  saveLocalConversations,
  getActiveConversationId,
  setActiveConversationId,
  getLocalBookmarks,
  saveLocalBookmarks,
  getLocalVault,
  saveLocalVault,
  syncLocalWithPuterCloud,
} from '@/lib/storage/local-adapter';
import {
  createNewConversationTree,
  appendTurnToActiveLeaf,
  branchFromNode,
  getBranchSiblingInfo,
  switchBranchToSibling,
  getLinearPath,
} from '@/lib/storage/tree-manager';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { ModelArena } from '@/components/arena/ModelArena';
import { PromptVaultModal } from '@/components/vault/PromptVaultModal';
import { BookmarksDrawer } from '@/components/bookmarks/BookmarksDrawer';

export default function VeloraApp() {
  // Persistence state
  const [conversations, setConversations] = useState<Record<string, ConversationTree>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [vault, setVault] = useState<PromptTemplate[]>([]);
  const [user, setUser] = useState<PuterUser | null>(null);

  // App UI state
  const [activeModel, setActiveModel] = useState<string>(DEFAULT_MODEL);
  const [input, setInput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingNodeId, setStreamingNodeId] = useState<string | null>(null);
  const [branchingFromNodeId, setBranchingFromNodeId] = useState<string | null>(null);

  // Modals & Drawers
  const [isArenaOpen, setIsArenaOpen] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // 1. Initial Load: LocalStorage & Puter Auth check
  useEffect(() => {
    const loadedConvs = getLocalConversations();
    const storedActiveId = getActiveConversationId();
    const loadedBookmarks = getLocalBookmarks();
    const loadedVault = getLocalVault();

    setConversations(loadedConvs);
    setBookmarks(loadedBookmarks);
    setVault(loadedVault);

    if (storedActiveId && loadedConvs[storedActiveId]) {
      setActiveId(storedActiveId);
    } else {
      const keys = Object.keys(loadedConvs);
      if (keys.length > 0) {
        setActiveId(keys[0]);
      }
    }

    // Check Puter Auth
    getPuterUser().then((u) => {
      if (u) {
        setUser(u);
        // Sync cloud KV with local
        syncLocalWithPuterCloud().then((synced) => {
          setConversations(synced.conversations);
          setBookmarks(synced.bookmarks);
          setVault(synced.vault);
        });
      }
    });

    // Theme check
    const savedTheme = localStorage.getItem('velora_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  // Update localStorage when conversations change
  const updateConversations = useCallback(
    (newConvs: Record<string, ConversationTree>) => {
      setConversations(newConvs);
      saveLocalConversations(newConvs);
    },
    []
  );

  // Update active conversation
  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setActiveConversationId(id);
    setBranchingFromNodeId(null);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.className = next;
    localStorage.setItem('velora_theme', next);
  };

  // Puter Authentication Handlers
  const handleSignIn = async () => {
    try {
      const signedInUser = await signInWithPuter();
      if (signedInUser) {
        setUser(signedInUser);
        const synced = await syncLocalWithPuterCloud();
        setConversations(synced.conversations);
        setBookmarks(synced.bookmarks);
        setVault(synced.vault);
      }
    } catch (err) {
      console.error('Failed to sign in via Puter:', err);
    }
  };

  const handleSignOut = async () => {
    await signOutPuter();
    setUser(null);
  };

  // Active conversation helper
  const currentConversation = activeId ? conversations[activeId] || null : null;

  // Bookmarks Map for fast lookup (messageId -> note)
  const bookmarksMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    bookmarks.forEach((b) => {
      map[b.messageId] = b.note || '';
    });
    return map;
  }, [bookmarks]);

  // Execute AI Stream Helper
  const executeChatTurn = async (
    targetConvId: string,
    assistantNodeId: string,
    messagesForModel: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    model: string
  ) => {
    setIsStreaming(true);
    setStreamingNodeId(assistantNodeId);

    let accumulated = '';

    try {
      await streamPuterChat({
        messages: messagesForModel,
        model,
        onChunk: (chunk) => {
          accumulated += chunk;
          setConversations((prev) => {
            const conv = prev[targetConvId];
            if (!conv) return prev;
            const node = conv.nodes[assistantNodeId];
            if (!node) return prev;

            const updatedNodes = {
              ...conv.nodes,
              [assistantNodeId]: { ...node, content: accumulated },
            };

            const updatedConv: ConversationTree = {
              ...conv,
              updatedAt: Date.now(),
              nodes: updatedNodes,
            };

            const updatedAll = { ...prev, [targetConvId]: updatedConv };
            saveLocalConversations(updatedAll);
            return updatedAll;
          });
        },
      });
    } catch (err) {
      console.error('Error during AI chat stream:', err);
    } finally {
      setIsStreaming(false);
      setStreamingNodeId(null);
    }
  };

  // Dispatch new prompt from chat input
  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput('');

    // Case 1: Branching from an earlier node
    if (currentConversation && branchingFromNodeId) {
      const { updatedTree, assistantNodeId } = branchFromNode(
        currentConversation,
        branchingFromNodeId,
        userText,
        activeModel
      );

      const newConvs = { ...conversations, [currentConversation.id]: updatedTree };
      updateConversations(newConvs);
      setBranchingFromNodeId(null);

      const pathNodes = getLinearPath(updatedTree, assistantNodeId);
      const messagesForModel = pathNodes
        .filter((n) => n.id !== assistantNodeId)
        .map((n) => ({ role: n.role, content: n.content }));

      await executeChatTurn(updatedTree.id, assistantNodeId, messagesForModel, activeModel);
      return;
    }

    // Case 2: Continuing current active conversation
    if (currentConversation) {
      const { updatedTree, assistantNodeId } = appendTurnToActiveLeaf(
        currentConversation,
        userText,
        activeModel
      );

      const newConvs = { ...conversations, [currentConversation.id]: updatedTree };
      updateConversations(newConvs);

      const pathNodes = getLinearPath(updatedTree, assistantNodeId);
      const messagesForModel = pathNodes
        .filter((n) => n.id !== assistantNodeId)
        .map((n) => ({ role: n.role, content: n.content }));

      await executeChatTurn(updatedTree.id, assistantNodeId, messagesForModel, activeModel);
      return;
    }

    // Case 3: Creating a brand new conversation
    const { tree, assistantNodeId } = createNewConversationTree(userText, activeModel);
    const newConvs = { ...conversations, [tree.id]: tree };
    updateConversations(newConvs);
    selectConversation(tree.id);

    const messagesForModel = [{ role: 'user' as const, content: userText }];
    await executeChatTurn(tree.id, assistantNodeId, messagesForModel, activeModel);
  };

  // Branch Navigation (< n / m >)
  const handleNavigateBranch = (nodeId: string, targetIndex: number) => {
    if (!currentConversation) return;
    const info = getBranchSiblingInfo(currentConversation, nodeId);
    const targetSiblingId = info.siblings[targetIndex];
    if (!targetSiblingId) return;

    const updatedTree = switchBranchToSibling(currentConversation, targetSiblingId);
    updateConversations({ ...conversations, [currentConversation.id]: updatedTree });
  };

  // Editorial Answer Controls (Explain Simply, Examples, Summarize, Deeper, Challenge)
  const handleAnswerControl = async (
    targetNodeId: string,
    action: AnswerControlAction,
    directive: string
  ) => {
    if (!currentConversation || isStreaming) return;

    const { updatedTree, assistantNodeId } = branchFromNode(
      currentConversation,
      targetNodeId,
      directive,
      activeModel
    );

    const newConvs = { ...conversations, [currentConversation.id]: updatedTree };
    updateConversations(newConvs);

    const pathNodes = getLinearPath(updatedTree, assistantNodeId);
    const messagesForModel = pathNodes
      .filter((n) => n.id !== assistantNodeId)
      .map((n) => ({ role: n.role, content: n.content }));

    await executeChatTurn(updatedTree.id, assistantNodeId, messagesForModel, activeModel);
  };

  // Fork an earlier turn
  const handleForkTurn = (nodeId: string) => {
    setBranchingFromNodeId(nodeId);
  };

  // Bookmarks Toggle & Note Management
  const handleToggleBookmark = (
    messageId: string,
    content: string,
    model: string,
    note?: string
  ) => {
    const existingIndex = bookmarks.findIndex((b) => b.messageId === messageId);
    let updated: Bookmark[];

    if (existingIndex >= 0) {
      if (note !== undefined) {
        // Update note
        updated = bookmarks.map((b) =>
          b.messageId === messageId ? { ...b, note: note } : b
        );
      } else {
        // Remove
        updated = bookmarks.filter((b) => b.messageId !== messageId);
      }
    } else {
      // Add
      const newBookmark: Bookmark = {
        id: 'bm_' + Date.now().toString(36),
        conversationId: activeId || '',
        messageId,
        content,
        model,
        note,
        createdAt: Date.now(),
      };
      updated = [newBookmark, ...bookmarks];
    }

    setBookmarks(updated);
    saveLocalBookmarks(updated);
  };

  // Adopt Winner from Model Arena
  const handleAdoptWinner = async (modelId: string, content: string, promptText: string) => {
    setIsArenaOpen(false);

    // Create a new thread or append to active
    const { tree, userNodeId, assistantNodeId } = createNewConversationTree(
      `[Arena Duel] ${promptText}`,
      modelId
    );

    // Fill in the assistant response immediately
    tree.nodes[assistantNodeId].content = content;

    const newConvs = { ...conversations, [tree.id]: tree };
    updateConversations(newConvs);
    selectConversation(tree.id);
  };

  // Conversation Organization Handlers
  const handleNewConversation = () => {
    setActiveId(null);
    setActiveConversationId(null);
    setBranchingFromNodeId(null);
  };

  const handleTogglePin = (id: string) => {
    const conv = conversations[id];
    if (!conv) return;
    const updated = { ...conv, isPinned: !conv.isPinned, updatedAt: Date.now() };
    updateConversations({ ...conversations, [id]: updated });
  };

  const handleToggleFavorite = (id: string) => {
    const conv = conversations[id];
    if (!conv) return;
    const updated = { ...conv, isFavorite: !conv.isFavorite, updatedAt: Date.now() };
    updateConversations({ ...conversations, [id]: updated });
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    const conv = conversations[id];
    if (!conv) return;
    const updated = { ...conv, title: newTitle, updatedAt: Date.now() };
    updateConversations({ ...conversations, [id]: updated });
  };

  const handleDeleteConversation = (id: string) => {
    const newConvs = { ...conversations };
    delete newConvs[id];
    updateConversations(newConvs);

    if (activeId === id) {
      const remainingKeys = Object.keys(newConvs);
      if (remainingKeys.length > 0) {
        selectConversation(remainingKeys[0]);
      } else {
        handleNewConversation();
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewConversation}
        onTogglePin={handleTogglePin}
        onToggleFavorite={handleToggleFavorite}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        isPuterSignedIn={Boolean(user)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          activeModel={activeModel}
          onSelectModel={setActiveModel}
          isArenaOpen={isArenaOpen}
          onToggleArena={() => setIsArenaOpen(!isArenaOpen)}
          onOpenVault={() => setIsVaultOpen(true)}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Viewport: Either Model Arena or Active Chat */}
        {isArenaOpen ? (
          <ModelArena
            onAdoptWinner={handleAdoptWinner}
            onClose={() => setIsArenaOpen(false)}
          />
        ) : (
          <main className="flex-1 flex flex-col overflow-hidden relative">
            <ChatContainer
              conversation={currentConversation}
              isStreaming={isStreaming}
              streamingNodeId={streamingNodeId}
              onNavigateBranch={handleNavigateBranch}
              onAnswerControl={handleAnswerControl}
              onForkTurn={handleForkTurn}
              onToggleBookmark={handleToggleBookmark}
              bookmarksMap={bookmarksMap}
              onSelectPromptStarter={(promptText) => {
                setInput(promptText);
              }}
              onOpenArena={() => setIsArenaOpen(true)}
              onOpenVault={() => setIsVaultOpen(true)}
            />

            {/* Input Bar */}
            <ChatInput
              input={input}
              setInput={setInput}
              onSubmit={handleSendMessage}
              isLoading={isStreaming}
              activeModel={activeModel}
              onOpenVault={() => setIsVaultOpen(true)}
              branchingFromNodeId={branchingFromNodeId}
              onCancelBranching={() => setBranchingFromNodeId(null)}
            />
          </main>
        )}
      </div>

      {/* Prompt Vault Modal */}
      <PromptVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        vault={vault}
        onSelectPrompt={(filledPrompt) => {
          setInput(filledPrompt);
        }}
        onSaveNewTemplate={(newTemplate) => {
          const updatedVault = [newTemplate, ...vault];
          setVault(updatedVault);
          saveLocalVault(updatedVault);
        }}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(bookmark) => {
          if (bookmark.conversationId && conversations[bookmark.conversationId]) {
            selectConversation(bookmark.conversationId);
          }
        }}
        onDeleteBookmark={(id) => {
          const updated = bookmarks.filter((b) => b.id !== id);
          setBookmarks(updated);
          saveLocalBookmarks(updated);
        }}
        onUpdateNote={(id, note) => {
          const updated = bookmarks.map((b) => (b.id === id ? { ...b, note } : b));
          setBookmarks(updated);
          saveLocalBookmarks(updated);
        }}
      />
    </div>
  );
}
