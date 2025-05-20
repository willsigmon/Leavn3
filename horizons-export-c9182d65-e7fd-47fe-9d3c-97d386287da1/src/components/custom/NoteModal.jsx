import React, { useState, useEffect } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { useLocalization } from '@/hooks/useLocalization';

    const NoteModal = ({ isOpen, onClose, verseId, initialNote = '', onSaveNote }) => {
      const { t } = useLocalization();
      const [noteText, setNoteText] = useState(initialNote);

      useEffect(() => {
        setNoteText(initialNote);
      }, [initialNote, isOpen]);

      const handleSave = () => {
        onSaveNote(verseId, noteText);
        onClose();
      };

      if (!isOpen) return null;

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px] glass-card p-6">
            <DialogHeader>
              <DialogTitle>{t('addNoteTo')} {verseId.replace(/_/g, ' ').replace(/(\d+)$/, ':$1')}</DialogTitle>
              <DialogDescription>
                {t('writeYourNoteBelow')}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={t('typeYourNoteHere')}
                className="min-h-[100px] rounded-lg"
                aria-label={t('noteInput')}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="rounded-xl">{t('cancel')}</Button>
              <Button onClick={handleSave} className="rounded-xl">{t('saveNote')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default NoteModal;