import React, { useState, useEffect, useCallback, useRef } from 'react';
    import ScripturePane from '@/components/custom/ScripturePane';
    import CompanionSidebar from '@/components/custom/CompanionSidebar';
    import VerseTools from '@/components/tools/VerseTools';
    import { useBibleNavigation } from '@/hooks/useBibleNavigation';
    import { useVerseSelectionHandler } from '@/hooks/useVerseSelectionHandler';
    import { useLocalization } from '@/hooks/useLocalization.jsx';
    import { useToast } from '@/components/ui/use-toast';

    const ReaderPage = ({ searchTarget, clearSearchTarget }) => {
      const { language, t } = useLocalization();
      const { toast } = useToast();
      const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
      const [showTags, setShowTags] = useState(true);
      const [showVerseTools, setShowVerseTools] = useState(false);

      const {
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
        jumpToVerse: jumpToVerseInternal,
      } = useBibleNavigation(searchTarget, clearSearchTarget, t, toast);

      const {
        selectedVerseObjects,
        setSelectedVerseObjects,
        highlightedVerseId,
        setHighlightedVerseId,
      } = useVerseSelectionHandler(searchTarget, selectedTranslation, verses, generateVerseId, clearSearchTarget, toast, t, currentBibleBooks, setSelectedBook, setSelectedChapter);
      
      const [generationalTone, setGenerationalTone] = useState('Millennial');
      const [theologicalViewpoint, setTheologicalViewpoint] = useState('Evangelical / Protestant');
      const [denomination, setDenomination] = useState('Non-denominational');

      useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      useEffect(() => {
        setShowVerseTools(selectedVerseObjects.length > 0);
      }, [selectedVerseObjects]);
      
      const jumpToVerse = useCallback((book, chapter, verseNumber) => {
        jumpToVerseInternal(book, chapter, verseNumber);
        const verseIdToHighlight = generateVerseId(selectedTranslation, book, chapter, verseNumber);
        setHighlightedVerseId(verseIdToHighlight);
      }, [jumpToVerseInternal, generateVerseId, selectedTranslation, setHighlightedVerseId]);


      const firstSelectedVerse = selectedVerseObjects.length > 0 ? selectedVerseObjects[0] : null;
      const firstSelectedVerseParsed = firstSelectedVerse ? parseVerseId(firstSelectedVerse.id) : {};

      return (
        <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-center gap-4 sm:gap-6 relative w-full">
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <ScripturePane
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              chapters={chaptersForCurrentBook}
              verses={verses}
              selectedVerseObjects={selectedVerseObjects}
              setSelectedVerseObjects={setSelectedVerseObjects}
              bibleBooks={currentBibleBooks}
              jumpToVerse={jumpToVerse}
              highlightedVerseId={highlightedVerseId}
              isLoading={isLoadingBook}
              showTags={showTags}
              setShowTags={setShowTags}
              onToggleTools={() => setShowVerseTools(prev => !prev)}
            />
            {showVerseTools && firstSelectedVerse && (
              <div className="mt-4 w-full">
                <VerseTools
                  book={firstSelectedVerseParsed.bookName}
                  chapter={firstSelectedVerseParsed.chapterNum}
                  verse={firstSelectedVerseParsed.verseNum}
                  verseId={firstSelectedVerse.id}
                  version={firstSelectedVerseParsed.versionAbbr}
                />
              </div>
            )}
          </div>
          <CompanionSidebar
            selectedVerseObjects={selectedVerseObjects}
            isMobile={isMobile}
            allLoadedBookData={allLoadedChapterData}
            selectedTranslation={selectedTranslation}
            generationalTone={generationalTone}
            setGenerationalTone={setGenerationalTone}
            theologicalViewpoint={theologicalViewpoint}
            setTheologicalViewpoint={setTheologicalViewpoint}
            denomination={denomination}
            setDenomination={setDenomination}
            currentChapterVerses={verses}
          />
        </div>
      );
    };

    export default ReaderPage;

