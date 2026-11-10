import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark as BookmarkIcon, ExternalLink, Search, Trash2, X } from 'lucide-react';
import { Bookmark } from '@/lib/types';
import { Button } from '../ui/button';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSelectBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
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
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border p-6 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/80 select-none">
            <div className="flex items-center gap-2">
              <BookmarkIcon className="w-5 h-5 text-editorial-bronze" />
              <div>
                <h2 className="font-serif text-lg text-foreground tracking-tight">Saved Reflections</h2>
                <p className="text-xs text-muted-foreground font-sans">
                  {bookmarks.length} bookmarked passage{bookmarks.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search bar */}
          <div className="relative my-4">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved reflections and notes..."
              className="w-full bg-muted/30 border border-border pl-8 pr-3 py-1.5 text-xs font-sans rounded-sm outline-none focus:border-editorial-bronze"
            />
          </div>

          {/* Bookmarks List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-4 bg-muted/20 border border-border/80 hover:border-editorial-bronze/50 rounded-sm space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono select-none">
                  <span className="text-editorial-bronze uppercase tracking-wider font-semibold">
                    {bookmark.model}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(bookmark.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-xs leading-relaxed text-foreground font-sans line-clamp-4 italic border-l-2 border-border/80 pl-2.5">
                  "{bookmark.content}"
                </p>

                {/* Personal Note Section */}
                <div className="pt-2 border-t border-border/40">
                  {editingId === bookmark.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        placeholder="Add or update your note..."
                        className="w-full h-16 bg-muted/40 border border-border p-2 text-xs font-sans rounded-sm outline-none resize-none"
                      />
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleSaveNote(bookmark.id)}>
                          Save Note
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      {bookmark.note ? (
                        <p
                          onClick={() => handleStartEditNote(bookmark)}
                          className="text-[11px] font-serif text-editorial-bronze/90 hover:underline cursor-pointer italic"
                          title="Click to edit note"
                        >
                          Note: {bookmark.note}
                        </p>
                      ) : (
                        <button
                          onClick={() => handleStartEditNote(bookmark)}
                          className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline"
                        >
                          + Add personal note
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <button
                    onClick={() => {
                      onSelectBookmark(bookmark);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium hover:text-editorial-bronze transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Go to Conversation</span>
                  </button>

                  <button
                    onClick={() => onDeleteBookmark(bookmark.id)}
                    className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredBookmarks.length === 0 && (
              <div className="py-16 text-center text-muted-foreground font-serif text-sm">
                No reflections saved yet.
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
