import { useRef, useCallback } from 'react';

    export const useVerseSelection = (verses, setSelectedVerseObjects) => {
      const lastSelectedVerseIndexRef = useRef(null);

      const handleVerseClick = useCallback((verse, verseIndex, event) => {
        const { shiftKey } = event;
        const verseId = verse.id;

        setSelectedVerseObjects(prevSelected => {
          const isSelected = prevSelected.find(v => v.id === verseId);

          if (shiftKey && lastSelectedVerseIndexRef.current !== null && prevSelected.length > 0) {
            const newSelection = new Set(prevSelected.map(v => v.id));
            
            const currentVerseActualIndex = verses.findIndex(v => v.id === verseId);
            
            // Find the ID of the verse that was *actually* last selected by a non-shift click
            // This requires finding the last verse in `prevSelected` that corresponds to `lastSelectedVerseIndexRef.current` if that ref still points to a valid index in `verses`
            let lastClickedVerseId = null;
            if (verses[lastSelectedVerseIndexRef.current]) {
                 lastClickedVerseId = prevSelected.find(pv => pv.id === verses[lastSelectedVerseIndexRef.current]?.id)?.id;
            }
            const lastSelectedActualIndex = lastClickedVerseId ? verses.findIndex(v => v.id === lastClickedVerseId) : -1;


            const start = Math.min(lastSelectedActualIndex !== -1 ? lastSelectedActualIndex : currentVerseActualIndex, currentVerseActualIndex);
            const end = Math.max(lastSelectedActualIndex !== -1 ? lastSelectedActualIndex : currentVerseActualIndex, currentVerseActualIndex);
            
            for (let i = start; i <= end; i++) {
                if(verses[i]) newSelection.add(verses[i].id);
            }
            return verses.filter(v => newSelection.has(v.id));

          } else if (shiftKey) { // If shift is pressed but it's the first click in a potential range
            lastSelectedVerseIndexRef.current = verseIndex;
            return isSelected ? prevSelected.filter(v => v.id !== verseId) : [...prevSelected, verse];
          } else { // Normal click (no shift)
            lastSelectedVerseIndexRef.current = verseIndex;
            // If clicking an already selected verse and it's the only one, deselect it. Otherwise, select just this one.
            return isSelected && prevSelected.length === 1 ? [] : [verse];
          }
        });
      }, [verses, setSelectedVerseObjects]);

      return { handleVerseClick, lastSelectedVerseIndexRef };
    };