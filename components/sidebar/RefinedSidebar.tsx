import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  FolderSync,
  Heart,
  Pin,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { ConversationTree } from '@/lib/types';
import { getLinearPath } from '@/lib/storage/tree-manager';

interface RefinedSidebarProps {
  conversations: Record<string, ConversationTree>;
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  isPuterSignedIn: boolean;
  onOpenBookmarks: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const RefinedSidebar: React.FC<RefinedSidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onTogglePin,
  onToggleFavorite,
  onRenameConversation,
  onDeleteConversation,
  isPuterSignedIn,
  isOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const convList = Object.values(conversations).sort((a, b) => b.updatedAt - a.updatedAt);

  const filtered = convList.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedConvs = filtered.filter((c) => c.isPinned);
  const favoriteConvs = filtered.filter((c) => c.isFavorite && !c.isPinned);
  const recentConvs = filtered.filter((c) => !c.isPinned && !c.isFavorite);

  const startRename = (conv: ConversationTree) => {
    setEditingId(conv.id);
    setRenameValue(conv.title);
  };

  const submitRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameConversation(id, renameValue.trim());
    }
    setEditingId(null);
  };

  const exportConversation = (conv: ConversationTree) => {
    const linearNodes = getLinearPath(conv);
    let md = `# ${conv.title}\n\n*Exported from VELORA — Editorial Intelligence*\n*Date: ${new Date(conv.updatedAt).toLocaleString()}*\n\n---\n\n`;

    linearNodes.forEach((node) => {
      const speaker = node.role === 'user' ? '### Inquiry' : `### Reflection (${node.model || 'Model'})`;
      md += `${speaker}\n\n${node.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${conv.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderConvItem = (conv: ConversationTree) => {
    const isActive = conv.id === activeId;
    const isEditing = editingId === conv.id;

    return (
      <div
        key={conv.id}
        className={`group relative flex items-center justify-between px-3 py-2 text-xs rounded-xs transition-colors cursor-pointer select-none ${
          isActive
            ? 'bg-velora-elevated text-velora-text font-medium border-l-2 border-velora-copper pl-2.5'
            : 'text-velora-textMuted hover:bg-velora-elevated/40 hover:text-velora-text'
        }`}
        onClick={() => {
          if (!isEditing) {
            onSelectConversation(conv.id);
            onCloseMobile();
          }
        }}
      >
        <div className="flex-1 min-w-0 pr-2">
          {isEditing ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename(conv.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="w-full bg-velora-surface border border-velora-border px-1.5 py-0.5 text-xs text-velora-text outline-none rounded-xs"
                autoFocus
              />
              <button
                onClick={() => submitRename(conv.id)}
                className="text-velora-sage hover:text-velora-sageLight p-0.5"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="block truncate font-serif text-[13px]">{conv.title}</span>
          )}
        </div>

        {/* Hover quick action cluster */}
        {!isEditing && (
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin */}
            <button
              onClick={() => onTogglePin(conv.id)}
              className={`p-1 hover:text-velora-text transition-colors ${
                conv.isPinned ? 'text-velora-copper' : 'text-velora-textMuted'
              }`}
              title={conv.isPinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin className="w-3 h-3" />
            </button>

            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(conv.id)}
              className={`p-1 hover:text-velora-text transition-colors ${
                conv.isFavorite ? 'text-rose-400' : 'text-velora-textMuted'
              }`}
              title={conv.isFavorite ? 'Remove from favorites' : 'Favorite'}
            >
              <Heart className={`w-3 h-3 ${conv.isFavorite ? 'fill-rose-400' : ''}`} />
            </button>

            {/* Rename */}
            <button
              onClick={() => startRename(conv)}
              className="p-1 text-velora-textMuted hover:text-velora-text transition-colors"
              title="Rename reflection"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            {/* Export */}
            <button
              onClick={() => exportConversation(conv)}
              className="p-1 text-velora-textMuted hover:text-velora-text transition-colors"
              title="Export as Markdown (.md)"
            >
              <Download className="w-3 h-3" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDeleteConversation(conv.id)}
              className="p-1 text-velora-textMuted hover:text-red-400 transition-colors"
              title="Delete reflection"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-velora-surface border-r border-velora-border flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-16' : 'w-72'}`}
      >
        {/* Brand & New Conversation */}
        <div className="p-4 border-b border-velora-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-tight text-velora-text">
                  VELORA
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-velora-elevated text-velora-copper border border-velora-border rounded-xs">
                  Editorial
                </span>
              </div>
            ) : (
              <span className="font-serif font-bold text-xl text-velora-copper mx-auto">V</span>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1 text-velora-textMuted hover:text-velora-text hover:bg-velora-elevated rounded-xs transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                onClick={onCloseMobile}
                className="lg:hidden text-velora-textMuted hover:text-velora-text p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              <button
                onClick={() => {
                  onNewConversation();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs uppercase tracking-wider font-mono bg-velora-text text-velora-bg hover:bg-white active:scale-[0.98] transition-all rounded-xs font-semibold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Reflection</span>
              </button>

              {/* Search bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-velora-textMuted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter reflections..."
                  className="w-full bg-velora-elevated/50 border border-velora-border pl-8 pr-2.5 py-1.5 text-xs font-sans text-velora-text placeholder:text-velora-textMuted/50 outline-none rounded-xs focus:border-velora-copper"
                />
              </div>
            </>
          )}

          {isCollapsed && (
            <button
              onClick={() => {
                onNewConversation();
                onToggleCollapse();
              }}
              className="w-8 h-8 mx-auto flex items-center justify-center bg-velora-text text-velora-bg rounded-xs hover:bg-white transition-colors"
              title="New Reflection"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Conversation Hierarchy List */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Pinned Section */}
            {pinnedConvs.length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted px-2 mb-1 flex items-center gap-1.5">
                  <Pin className="w-3 h-3 text-velora-copper" />
                  <span>Pinned ({pinnedConvs.length})</span>
                </div>
                <div className="space-y-0.5">{pinnedConvs.map(renderConvItem)}</div>
              </div>
            )}

            {/* Favorites Section */}
            {favoriteConvs.length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted px-2 mb-1 flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-rose-400" />
                  <span>Favorites ({favoriteConvs.length})</span>
                </div>
                <div className="space-y-0.5">{favoriteConvs.map(renderConvItem)}</div>
              </div>
            )}

            {/* Recent Ledger */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted px-2 mb-1">
                Chronicle ({recentConvs.length})
              </div>
              <div className="space-y-0.5">
                {recentConvs.map(renderConvItem)}
                {recentConvs.length === 0 && pinnedConvs.length === 0 && favoriteConvs.length === 0 && (
                  <div className="px-3 py-8 text-center text-velora-textMuted/60 text-xs font-serif italic">
                    The ledger is clean. Dispatch an inquiry to begin.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer / Puter Sync Status & Legal */}
        {!isCollapsed && (
          <div className="p-3 border-t border-velora-border bg-velora-elevated/30 text-xs select-none">
            {/* Puter Cloud Sync State */}
            <div className="flex items-center justify-between text-[11px] font-mono text-velora-textMuted mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <FolderSync className="w-3.5 h-3.5 text-velora-copper" />
                <span>{isPuterSignedIn ? 'Puter Cloud Synced' : 'Local Sandbox Mode'}</span>
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPuterSignedIn ? 'bg-velora-sage' : 'bg-amber-400'
                }`}
              />
            </div>

            {/* Legal Links */}
            <div className="flex items-center justify-between text-[11px] font-sans text-velora-textMuted/80 px-1 pt-1.5 border-t border-velora-border/40">
              <Link href="/privacy" className="hover:text-velora-text transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-velora-text transition-colors">
                Terms
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
