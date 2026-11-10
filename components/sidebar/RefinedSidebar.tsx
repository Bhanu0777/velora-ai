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
  GitBranch,
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
    let md = `# ${conv.title}\n\n*Exported from VELORA*\n*Date: ${new Date(conv.updatedAt).toLocaleString()}*\n\n---\n\n`;

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
        className={`group relative flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all cursor-pointer select-none mb-0.5 ${
          isActive
            ? 'bg-white/[0.08] text-white font-medium'
            : 'text-velora-textMuted hover:bg-white/[0.04] hover:text-velora-text'
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
                className="w-full bg-[#181B20] border border-white/10 px-2 py-0.5 text-xs text-white outline-none rounded-md"
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
            <span className="block truncate font-serif text-[13.5px]">{conv.title}</span>
          )}
        </div>

        {/* Hover quick action cluster */}
        {!isEditing && (
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onTogglePin(conv.id)}
              className={`p-1 hover:text-white transition-colors ${
                conv.isPinned ? 'text-velora-copper' : 'text-velora-textMuted/60'
              }`}
              title={conv.isPinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin className="w-3 h-3" />
            </button>

            <button
              onClick={() => onToggleFavorite(conv.id)}
              className={`p-1 hover:text-white transition-colors ${
                conv.isFavorite ? 'text-rose-400' : 'text-velora-textMuted/60'
              }`}
              title={conv.isFavorite ? 'Remove favorite' : 'Favorite'}
            >
              <Heart className={`w-3 h-3 ${conv.isFavorite ? 'fill-rose-400' : ''}`} />
            </button>

            <button
              onClick={() => startRename(conv)}
              className="p-1 text-velora-textMuted/60 hover:text-white transition-colors"
              title="Rename"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            <button
              onClick={() => exportConversation(conv)}
              className="p-1 text-velora-textMuted/60 hover:text-white transition-colors"
              title="Export as Markdown (.md)"
            >
              <Download className="w-3 h-3" />
            </button>

            <button
              onClick={() => onDeleteConversation(conv.id)}
              className="p-1 text-velora-textMuted/60 hover:text-red-400 transition-colors"
              title="Delete"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-[#0A0B0E] border-r border-white/[0.05] flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-16' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <span className="font-serif font-bold text-lg tracking-tight text-white">
                VELORA
              </span>
            ) : (
              <span className="font-serif font-bold text-xl text-velora-copper mx-auto">V</span>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1 text-velora-textMuted/60 hover:text-white rounded-md transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                onClick={onCloseMobile}
                className="lg:hidden text-velora-textMuted hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* New Reflection Button */}
          {!isCollapsed && (
            <>
              <button
                onClick={() => {
                  onNewConversation();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between py-2 px-3 text-xs bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl transition-all font-medium active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-velora-copper" />
                  <span>New Reflection</span>
                </span>
                <span className="text-[10px] text-velora-textMuted/50 font-mono">
                  ⌘N
                </span>
              </button>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-velora-textMuted/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-white/[0.03] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-velora-textMuted/40 outline-none rounded-xl focus:bg-white/[0.05]"
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
              className="w-8 h-8 mx-auto flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl transition-colors"
              title="New Reflection (⌘N)"
            >
              <Plus className="w-4 h-4 text-velora-copper" />
            </button>
          )}
        </div>

        {/* Conversation Hierarchy List */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto px-2 space-y-4">
            {/* Pinned Section */}
            {pinnedConvs.length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted/50 px-3 mb-1 flex items-center gap-1.5">
                  <Pin className="w-3 h-3 text-velora-copper" />
                  <span>Pinned</span>
                </div>
                <div>{pinnedConvs.map(renderConvItem)}</div>
              </div>
            )}

            {/* Favorites Section */}
            {favoriteConvs.length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted/50 px-3 mb-1 flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-rose-400" />
                  <span>Favorites</span>
                </div>
                <div>{favoriteConvs.map(renderConvItem)}</div>
              </div>
            )}

            {/* Recent Chronicle */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-velora-textMuted/50 px-3 mb-1">
                Recent
              </div>
              <div>
                {recentConvs.map(renderConvItem)}
                {recentConvs.length === 0 && pinnedConvs.length === 0 && favoriteConvs.length === 0 && (
                  <div className="px-3 py-8 text-center text-velora-textMuted/40 text-xs font-serif italic">
                    No reflections yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer / Puter Sync Status & Legal */}
        {!isCollapsed && (
          <div className="p-3 border-t border-white/[0.04] text-xs select-none">
            {/* Puter Cloud Sync State */}
            <div className="flex items-center justify-between text-[11px] font-mono text-velora-textMuted/70 mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <FolderSync className="w-3.5 h-3.5 text-velora-copper" />
                <span>{isPuterSignedIn ? 'Puter Cloud Synced' : 'Local Mode'}</span>
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPuterSignedIn ? 'bg-velora-sage' : 'bg-amber-400'
                }`}
              />
            </div>

            {/* Legal Links */}
            <div className="flex items-center justify-between text-[11px] font-sans text-velora-textMuted/50 px-1 pt-1 border-t border-white/[0.04]">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
