import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Check,
  Edit2,
  FolderSync,
  Heart,
  MoreVertical,
  Pin,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { ConversationTree } from '@/lib/types';
import { Button } from '../ui/button';

interface SidebarProps {
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onTogglePin,
  onToggleFavorite,
  onRenameConversation,
  onDeleteConversation,
  isPuterSignedIn,
  onOpenBookmarks,
  isOpen,
  onCloseMobile,
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

  const renderConvItem = (conv: ConversationTree) => {
    const isActive = conv.id === activeId;
    const isEditing = editingId === conv.id;

    return (
      <div
        key={conv.id}
        className={`group relative flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-colors cursor-pointer select-none ${
          isActive
            ? 'bg-muted text-foreground font-medium border-l-2 border-editorial-bronze pl-2.5'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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
                className="w-full bg-background border border-border px-1.5 py-0.5 text-xs text-foreground outline-none rounded-sm"
                autoFocus
              />
              <button
                onClick={() => submitRename(conv.id)}
                className="text-emerald-400 hover:text-emerald-300 p-0.5"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="block truncate font-serif text-[13px]">{conv.title}</span>
          )}
        </div>

        {/* Hover quick actions */}
        {!isEditing && (
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin Toggle */}
            <button
              onClick={() => onTogglePin(conv.id)}
              className={`p-1 hover:text-foreground transition-colors ${
                conv.isPinned ? 'text-editorial-bronze' : 'text-muted-foreground'
              }`}
              title={conv.isPinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin className="w-3 h-3" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => onToggleFavorite(conv.id)}
              className={`p-1 hover:text-foreground transition-colors ${
                conv.isFavorite ? 'text-rose-400' : 'text-muted-foreground'
              }`}
              title={conv.isFavorite ? 'Remove from favorites' : 'Favorite'}
            >
              <Heart className={`w-3 h-3 ${conv.isFavorite ? 'fill-rose-400' : ''}`} />
            </button>

            {/* Rename */}
            <button
              onClick={() => startRename(conv)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Rename reflection"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDeleteConversation(conv.id)}
              className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-card border-r border-border flex flex-col transition-transform duration-250 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & New Conversation */}
        <div className="p-4 border-b border-border/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-tight text-foreground">
                VELORA
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-muted text-muted-foreground border border-border/80 rounded-sm">
                v1.0
              </span>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => {
              onNewConversation();
              onCloseMobile();
            }}
            variant="primary"
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reflection</span>
          </Button>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-muted/40 border border-border/80 pl-8 pr-2.5 py-1.5 text-xs font-sans text-foreground placeholder:text-muted-foreground/60 outline-none rounded-sm focus:border-editorial-bronze"
            />
          </div>
        </div>

        {/* Conversation List Categories */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Pinned Section */}
          {pinnedConvs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 mb-1 flex items-center gap-1">
                <Pin className="w-3 h-3 text-editorial-bronze" />
                <span>Pinned</span>
              </div>
              <div className="space-y-0.5">{pinnedConvs.map(renderConvItem)}</div>
            </div>
          )}

          {/* Favorites Section */}
          {favoriteConvs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>Favorites</span>
              </div>
              <div className="space-y-0.5">{favoriteConvs.map(renderConvItem)}</div>
            </div>
          )}

          {/* Recent Section */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 mb-1">
              Conversations ({recentConvs.length})
            </div>
            <div className="space-y-0.5">
              {recentConvs.map(renderConvItem)}
              {recentConvs.length === 0 && pinnedConvs.length === 0 && favoriteConvs.length === 0 && (
                <div className="px-3 py-6 text-center text-muted-foreground text-xs font-serif italic">
                  No conversations yet. Start a new one above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Puter Sync Status & Legal */}
        <div className="p-3 border-t border-border/80 bg-muted/20 text-xs select-none">
          {/* Puter Sync Pill */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <FolderSync className="w-3.5 h-3.5 text-editorial-bronze" />
              <span>{isPuterSignedIn ? 'Puter Cloud Synced' : 'Local Storage Mode'}</span>
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPuterSignedIn ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </div>

          {/* Legal and compliance links */}
          <div className="flex items-center justify-between text-[11px] font-sans text-muted-foreground/80 px-1 pt-1 border-t border-border/40">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
