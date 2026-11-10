import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark, X } from 'lucide-react';

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
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#14161A] border border-white/10 p-6 shadow-2xl rounded-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-velora-text font-serif text-lg tracking-tight">
              <Bookmark className="w-4 h-4 text-velora-copper" />
              <span>{isBookmarked ? 'Edit Bookmark Note' : 'Bookmark Reflection'}</span>
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

          <div className="py-4 space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-velora-textMuted/60 block">
              Personal Commentary / Context Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record why this thesis or synthesis is significant..."
              className="w-full h-28 bg-white/[0.03] border border-white/10 focus:border-velora-copper/50 p-3 text-xs font-sans leading-relaxed text-velora-text placeholder:text-velora-textMuted/40 resize-none outline-none rounded-xl"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-velora-textMuted hover:text-velora-text rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium bg-velora-copper hover:bg-velora-copperLight text-white rounded-full transition-all shadow-sm active:scale-95"
            >
              Save Bookmark
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

