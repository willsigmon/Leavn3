import { useState, useEffect, useCallback } from 'react';

    export const useVerseSelectionHandler = (
      searchTarget, 
      selectedTranslation, 
      verses, 
      generateVerseId,
      clearSearchTarget,
      toast,
      t,
      currentBibleBooks,
      setSelectedBook, 
      setSelectedChapter
    ) => {
      const [selectedVerseObjects, setSelectedVerseObjects] = useState([]);
      const [highlightedVerseId, setHighlightedVerseId] = useState(null);

      useEffect(() => {
        if (searchTarget && currentBibleBooks.length > 0 && verses.length > 0) {
          const targetBookExists = currentBibleBooks.includes(searchTarget.book);
          if (targetBookExists) {
            if (searchTarget.book !== setSelectedBook.current || searchTarget.chapter !== setSelectedChapter.current) {
                 setSelectedBook(searchTarget.book);
                 setSelectedChapter(searchTarget.chapter);
            }

            if (searchTarget.verse) {
              const verseIdToHighlight = generateVerseId(selectedTranslation, searchTarget.book, searchTarget.chapter, searchTarget.verse);
              setHighlightedVerseId(verseIdToHighlight);
              
              const targetVerseObject = verses.find(v => v.id === verseIdToHighlight);
              if (targetVerseObject) {
                setSelectedVerseObjects([targetVerseObject]);
              } else {
                setSelectedVerseObjects([]); 
              }
            } else {
              setHighlightedVerseId(null);
              setSelectedVerseObjects([]);
            }
          } else {
            toast({ title: t('error'), description: t('bookNotFound', { book: searchTarget.book }), variant: "destructive" });
            if(clearSearchTarget) clearSearchTarget();
            setSelectedVerseObjects([]);
            setHighlightedVerseId(null);
          }
        } else if (!searchTarget) {
            setSelectedVerseObjects([]);
            setHighlightedVerseId(null);
        }
      }, [
        searchTarget, 
        currentBibleBooks, 
        selectedTranslation, 
        verses, 
        generateVerseId, 
        clearSearchTarget, 
        toast, 
        t, 
        setSelectedBook, 
        setSelectedChapter
      ]);
      
      return {
        selectedVerseObjects,
        setSelectedVerseObjects,
        highlightedVerseId,
        setHighlightedVerseId,
      };
    };