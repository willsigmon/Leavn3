import { useState, useCallback } from 'react';
    import { useLocalization } from '@/hooks/useLocalization';

    export const useVerseInteraction = (verseUserData, updateVerseUserData, setSelectedVerseObjects, verses, lastSelectedVerseIndexRef) => {
      const { t } = useLocalization();
      const [radialMenuState, setRadialMenuState] = useState({ isOpen: false, x: 0, y: 0, verseId: null });
      const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
      const [currentNoteData, setCurrentNoteData] = useState({ verseId: null, text: '' });

      const handleVerseContextMenu = useCallback((event, verseId) => {
        event.preventDefault();
        setSelectedVerseObjects(prevSelected => {
          if (!prevSelected.find(v => v.id === verseId)) {
            const verseToSelect = verses.find(v => v.id === verseId);
            if (verseToSelect) {
              const verseIndex = verses.findIndex(v => v.id === verseId);
              lastSelectedVerseIndexRef.current = verseIndex;
              return [verseToSelect];
            }
          }
          return prevSelected;
        });
        setRadialMenuState({ isOpen: true, x: event.clientX, y: event.clientY, verseId });
      }, [setSelectedVerseObjects, verses, lastSelectedVerseIndexRef]);

      const closeRadialMenu = useCallback(() => {
        setRadialMenuState(prev => ({ ...prev, isOpen: false }));
      }, []);

      const handleRadialAction = useCallback(async (action) => {
        const verseId = radialMenuState.verseId;
        if (!verseId) return;

        const currentData = verseUserData[verseId] || { verseId };
        let newData = { ...currentData };

        if (action.startsWith('highlight-')) {
          const color = action.split('-')[1];
          newData.highlight = currentData.highlight === color ? null : color;
        } else if (action === 'add-note') {
          setCurrentNoteData({ verseId, text: currentData.note || '' });
          setIsNoteModalOpen(true);
          closeRadialMenu(); 
          return;
        } else if (action === 'remove-highlight') {
          newData.highlight = null;
        }
        
        await updateVerseUserData(verseId, newData);
        closeRadialMenu();
      }, [radialMenuState.verseId, verseUserData, updateVerseUserData, closeRadialMenu]);

      const handleSaveNote = useCallback(async (verseId, noteText) => {
        const currentData = verseUserData[verseId] || { verseId };
        const newData = { ...currentData, note: noteText };
        await updateVerseUserData(verseId, newData, t('noteSaved'), t('noteSavedSuccess'), t('noteSaveError'));
        setIsNoteModalOpen(false);
      }, [verseUserData, updateVerseUserData, t]);

      return {
        radialMenuState,
        isNoteModalOpen,
        currentNoteData,
        handleVerseContextMenu,
        closeRadialMenu,
        handleRadialAction,
        handleSaveNote,
        setIsNoteModalOpen
      };
    };