import { useState, useEffect, useCallback, useRef } from 'react';
    import { bibleBookNames, getChaptersForBook, fetchBookData, getVerseLocation } from '@/lib/bibleData';

    export const useBibleNavigation = (searchTarget, clearSearchTarget, t, toast) => {
      const [selectedTranslation, setSelectedTranslation] = useState('KJV');
      const [currentBibleBooks, setCurrentBibleBooks] = useState([]);
      const [selectedBook, setSelectedBook] = useState('');
      const [selectedChapter, setSelectedChapter] = useState('1');
      const [allLoadedChapterData, setAllLoadedChapterData] = useState({});
      const [chaptersForCurrentBook, setChaptersForCurrentBook] = useState([]);
      const [verses, setVerses] = useState([]);
      const [isLoadingBook, setIsLoadingBook] = useState(true);
      const currentDataFetchId = useRef(0);

      useEffect(() => {
        const initBookList = async () => {
          setIsLoadingBook(true);
          const bookNames = await bibleBookNames();
          setCurrentBibleBooks(bookNames);
          if (bookNames.length > 0 && !selectedBook) {
            setSelectedBook(bookNames[0]);
          } else if (bookNames.length === 0) {
            console.warn("No Bible books loaded from Supabase.");
            setVerses([{ text: t('errorLoadingBibleData'), id: 'init_error', number: 1, tags: [], location: null }]);
          }
          setIsLoadingBook(false); 
        };
        initBookList();
      }, [t, selectedBook]);

      const generateVerseId = useCallback((translation, book, chapter, verseNumber) => {
        return `${translation}_${book}_${chapter}_${verseNumber}`;
      }, []);

      const parseVerseId = useCallback((verseId) => {
        if (!verseId || typeof verseId !== 'string') return {};
        const parts = verseId.split('_');
        if (parts.length < 4) return { versionAbbr: parts[0], bookName: parts[1], chapterNum: parts[2], verseNum: ''}; // Handle incomplete IDs
        return {
          versionAbbr: parts[0],
          bookName: parts[1],
          chapterNum: parts[2],
          verseNum: parts[3],
        };
      }, []);

      useEffect(() => {
        const loadChapterListAndData = async () => {
          if (!selectedBook || !selectedTranslation) {
            setIsLoadingBook(false);
            return;
          }

          currentDataFetchId.current += 1;
          const fetchId = currentDataFetchId.current;
          setIsLoadingBook(true);
          setVerses([]);

          try {
            const chapterList = await getChaptersForBook(selectedBook);
            if (fetchId !== currentDataFetchId.current) return;

            setChaptersForCurrentBook(chapterList.length > 0 ? chapterList : ['1']);

            let currentChapterToLoad = selectedChapter;
            if (chapterList.length > 0 && !chapterList.includes(selectedChapter)) {
              currentChapterToLoad = chapterList[0];
              setSelectedChapter(currentChapterToLoad);
            } else if (chapterList.length === 0) {
              currentChapterToLoad = '1';
              setSelectedChapter('1');
            }
            
            const chapterKey = `${selectedBook}_${selectedTranslation}_${currentChapterToLoad}`;
            let chapterData = allLoadedChapterData[chapterKey];

            if (!chapterData) {
              chapterData = await fetchBookData(selectedBook, selectedTranslation, currentChapterToLoad);
              if (fetchId === currentDataFetchId.current) {
                setAllLoadedChapterData(prev => ({ ...prev, [chapterKey]: chapterData }));
              } else {
                setIsLoadingBook(false); return;
              }
            }
            
            if (fetchId !== currentDataFetchId.current) { setIsLoadingBook(false); return; }

            const versesFromChapter = chapterData?.[currentChapterToLoad] || [];
            
            if (versesFromChapter.length === 0 || (versesFromChapter[0] && (versesFromChapter[0].id === 'not_found' || versesFromChapter[0].id === 'error'))) {
              if (versesFromChapter[0] && versesFromChapter[0].id === 'error' && versesFromChapter[0].text) {
                setVerses([{ text: versesFromChapter[0].text, id: 'load_error', number: 1, tags: [], location: null }]);
              } else {
                setVerses(versesFromChapter);
              }
            } else {
              const formattedVersesPromises = versesFromChapter.map(async (verseData, index) => {
                const verseId = generateVerseId(selectedTranslation, selectedBook, currentChapterToLoad, verseData.number || index + 1);
                const locationComponents = parseVerseId(verseId);
                let location = null;
                if (locationComponents.bookName && locationComponents.versionAbbr && locationComponents.chapterNum && locationComponents.verseNum) {
                  location = await getVerseLocation(locationComponents);
                }
                return {
                  id: verseId,
                  text: verseData.text,
                  tags: verseData.tags || [],
                  number: verseData.number || index + 1,
                  location: location || null
                };
              });
              const formattedVerses = await Promise.all(formattedVersesPromises);
              if (fetchId !== currentDataFetchId.current) { setIsLoadingBook(false); return; }
              setVerses(formattedVerses);
            }
            
            if (searchTarget?.book !== selectedBook || searchTarget?.chapter !== currentChapterToLoad) {
               if(searchTarget) clearSearchTarget();
            }

          } catch (error) {
            console.error("Error in loadChapterListAndData (useBibleNavigation):", error);
            const errorMessage = error.message || t('genericLoadError');
            setVerses([{ text: errorMessage, id: 'load_error', number: 1, tags: [], location: null }]);
            if (fetchId === currentDataFetchId.current) {
              toast({ title: t('error'), description: errorMessage, variant: "destructive" });
            }
          } finally {
            if (fetchId === currentDataFetchId.current) {
              setIsLoadingBook(false);
            }
          }
        };

        loadChapterListAndData();
      }, [selectedTranslation, selectedBook, selectedChapter, t, toast, searchTarget, clearSearchTarget, allLoadedChapterData, generateVerseId, parseVerseId]);


      const jumpToVerse = useCallback((book, chapter, verseNumber) => {
        const targetBookExists = currentBibleBooks.includes(book);
        if (targetBookExists) {
          setSelectedBook(book);
          setSelectedChapter(chapter);
        } else {
          toast({ title: t('error'), description: t('bookNotFound', { book }), variant: "destructive" });
        }
      }, [currentBibleBooks, toast, t]);

      return {
        selectedTranslation,
        setSelectedTranslation,
        currentBibleBooks,
        selectedBook,
        setSelectedBook,
        selectedChapter,
        setSelectedChapter,
        chaptersForCurrentBook,
        verses,
        isLoadingBook,
        allLoadedChapterData,
        generateVerseId,
        parseVerseId,
        jumpToVerse,
      };
    };