import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark as BookmarkIcon, ExternalLink, Search, Trash2, X, Edit3 } from 'lucide-react';
import { Bookmark } from '@/lib/types';
import { SpotlightCard } from '../ui/SpotlightCard';

interface RefinedBookmarksProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSelectBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}

export const RefinedBookmarks: React.FC<RefinedBookmarksProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onDeleteBookmark,
  onUpdateNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState('');

  // Reset search and any open note editor when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setEditingId(null);
      setEditingNote('');
    }
  }, [isOpen]);

  const filteredBookmarks = bookmarks.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.content.toLowerCase().includes(q) ||
      (b.note && b.note.toLowerCase().includes(q)) ||
      b.model.toLowerCase().includes(q)
    );
  });

  const handleStartEditNote = (b: Bookmark) => {
    setEditingId(b.id);
    setEditingNote(b.note || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNote(id, editingNote.trim());
    setEditingId(null);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#14161A] border-l border-white/10 p-6 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-250 select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-velora-copper">
                <BookmarkIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-velora-text tracking-tight">Saved Reflections</h2>
                <p className="text-xs text-velora-textMuted font-sans">
                  {bookmarks.length} bookmarked reflection{bookmarks.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-velora-textMuted hover:text-velora-text transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search bar */}
          <div className="relative my-4">
            <Search className="w-3.5 h-3.5 text-velora-textMuted/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved reflections and notes..."
              className="w-full bg-white/[0.03] border border-white/10 pl-8 pr-3 py-1.5 text-xs font-sans rounded-xl outline-none focus:border-velora-copper/50 text-velora-text placeholder:text-velora-textMuted/40"
            />
          </div>

          {/* List of Bookmarks with Spotlight Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 select-text">
            {filteredBookmarks.map((bookmark) => (
              <SpotlightCard
                key={bookmark.id}
                className="p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-[10px] font-mono select-none">
                  <span className="text-velora-copper uppercase tracking-wider font-semibold">
                    {bookmark.model}
                  </span>
                  <span className="text-velora-textMuted/60">
                    {new Date(bookmark.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-xs leading-relaxed text-velora-text font-sans line-clamp-4 italic border-l-2 border-velora-copper/30 pl-3">
                  "{bookmark.content}"
                </p>

                {/* Personal Note Editor */}
                <div className="pt-2 border-t border-white/[0.06]">
                  {editingId === bookmark.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        placeholder="Add or update personal insight..."
                        className="w-full h-18 bg-white/[0.04] border border-white/10 p-2.5 text-xs font-sans rounded-xl outline-none resize-none text-velora-text"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-velora-textMuted hover:text-velora-text"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(bookmark.id)}
                          className="px-3.5 py-1 text-xs font-medium bg-velora-copper hover:bg-velora-copperLight text-white rounded-full transition-all shadow-sm"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs select-none">
                      {bookmark.note ? (
                        <p
                          onClick={() => handleStartEditNote(bookmark)}
                          className="text-[11px] font-serif text-velora-copperLight hover:underline cursor-pointer italic"
                          title="Click to edit annotation"
                        >
                          Note: "{bookmark.note}"
                        </p>
                      ) : (
                        <button
                          onClick={() => handleStartEditNote(bookmark)}
                          className="text-[10px] font-sans text-velora-textMuted/70 hover:text-velora-text underline"
                        >
                          + Add personal insight
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs select-none">
                  <button
                    onClick={() => {
                      onSelectBookmark(bookmark);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-velora-text font-medium hover:text-velora-copper transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Navigate to Turn</span>
                  </button>

                  <button
                    onClick={() => onDeleteBookmark(bookmark.id)}
                    className="text-velora-textMuted hover:text-red-400 transition-colors p-1"
                    title="Remove from saved reflections"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </SpotlightCard>
            ))}

            {filteredBookmarks.length === 0 && (
              <div className="py-20 text-center text-velora-textMuted/50 font-serif text-sm">
                No reflections saved in the ledger.
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

