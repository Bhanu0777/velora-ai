import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark, X } from 'lucide-react';
import { Button } from '../ui/button';

interface BookmarkNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  initialNote?: string;
  isBookmarked: boolean;
}

export const BookmarkNoteModal: React.FC<BookmarkNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote = '',
  isBookmarked,
}) => {
  const [note, setNote] = useState(initialNote);

  const handleSave = () => {
    onSave(note.trim());
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border p-6 shadow-2xl rounded-sm z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2 text-foreground font-serif text-lg tracking-tight">
              <Bookmark className="w-4 h-4 text-editorial-bronze" />
              <span>{isBookmarked ? 'Edit Bookmark Note' : 'Bookmark Reflection'}</span>
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

          <div className="py-4 space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
              Personal Commentary / Context Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record why this thesis or synthesis is significant..."
              className="w-full h-28 bg-muted/30 border border-border/80 focus:border-editorial-bronze p-3 text-xs font-sans leading-relaxed text-foreground placeholder:text-muted-foreground/50 resize-none outline-none rounded-sm"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Bookmark
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

