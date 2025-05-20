import React, { useRef, useState, useEffect, useCallback } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import TagModal from '@/components/custom/TagModal';
    import RadialMenu from '@/components/custom/RadialMenu';
    import NoteModal from '@/components/custom/NoteModal';
    import ScripturePaneHeader from '@/components/custom/ScripturePaneHeader';
    import VerseDisplay from '@/components/custom/VerseDisplay';
    import { useLocalization } from '@/hooks/useLocalization';
    import { useToast } from '@/components/ui/use-toast';
    import { Skeleton } from "@/components/ui/skeleton";
    import { useVerseUserData } from '@/hooks/useVerseUserData';
    import { useVerseSelection } from '@/hooks/useVerseSelection';
    import { useVerseInteraction } from '@/hooks/useVerseInteraction';


    const ScripturePane = ({
      selectedTranslation,
      setSelectedTranslation,
      selectedBook,
      setSelectedBook,
      selectedChapter,
      setSelectedChapter,
      chapters,
      verses,
      selectedVerseObjects,
      setSelectedVerseObjects,
      bibleBooks,
      jumpToVerse,
      highlightedVerseId,
      isLoading,
      showTags,
      setShowTags
    }) => {
      const { t } = useLocalization();
      const scripturePaneRef = useRef(null);
      const chapterTitleRef = useRef(null);
      
      const [isTagModalOpen, setIsTagModalOpen] = useState(false);
      const [activeTagData, setActiveTagData] = useState({ tagName: null, verseId: null });
      
      const { verseUserData, updateVerseUserData, loadAllUserData } = useVerseUserData();
      const { handleVerseClick, lastSelectedVerseIndexRef } = useVerseSelection(verses, setSelectedVerseObjects);
      const { 
        radialMenuState, 
        isNoteModalOpen, 
        currentNoteData,
        handleVerseContextMenu,
        closeRadialMenu,
        handleRadialAction,
        handleSaveNote,
        setIsNoteModalOpen,
      } = useVerseInteraction(verseUserData, updateVerseUserData, setSelectedVerseObjects, verses, lastSelectedVerseIndexRef);


      const verseRefs = useRef({});

      useEffect(() => {
        loadAllUserData();
      }, [loadAllUserData]);
      
      useEffect(() => {
        if (highlightedVerseId && verseRefs.current[highlightedVerseId]) {
          verseRefs.current[highlightedVerseId].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (!isLoading && scripturePaneRef.current && !selectedVerseObjects.length && !highlightedVerseId) {
          if (chapterTitleRef.current) {
            chapterTitleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (scripturePaneRef.current) {
            scripturePaneRef.current.scrollTop = 0;
          }
        }
      }, [highlightedVerseId, selectedBook, selectedChapter, isLoading, selectedVerseObjects.length]);


      const handleNextChapter = () => {
        const currentChapterIndex = chapters.indexOf(selectedChapter);
        if (currentChapterIndex < chapters.length - 1) {
          setSelectedChapter(chapters[currentChapterIndex + 1]);
          setSelectedVerseObjects([]); 
          lastSelectedVerseIndexRef.current = null;
        }
      };

      const handlePrevChapter = () => {
        const currentChapterIndex = chapters.indexOf(selectedChapter);
        if (currentChapterIndex > 0) {
          setSelectedChapter(chapters[currentChapterIndex - 1]);
          setSelectedVerseObjects([]); 
          lastSelectedVerseIndexRef.current = null;
        }
      };

      const handleTagClick = (tagName, verseId) => {
        setActiveTagData({ tagName, verseId });
        setIsTagModalOpen(true);
      };
      
      const selectedVerseIds = selectedVerseObjects.map(v => v.id);

      return (
        <>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl lg:w-2/3 flex flex-col glass-card p-4 sm:p-6"
          aria-label={t('scriptureReadingPane')}
        >
          <ScripturePaneHeader
            selectedTranslation={selectedTranslation}
            setSelectedTranslation={setSelectedTranslation}
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            bibleBooks={bibleBooks}
            chapters={chapters}
            onPrevChapter={handlePrevChapter}
            onNextChapter={handleNextChapter}
            lastSelectedVerseIndexRef={lastSelectedVerseIndexRef}
            isLoading={isLoading}
            showTags={showTags}
            setShowTags={setShowTags}
            setSelectedVerseObjects={setSelectedVerseObjects}
          />
          <div 
            ref={scripturePaneRef} 
            className="flex-grow overflow-y-auto pr-2 pl-1 py-1 scrollbar-thin scroll-smooth snap-y snap-mandatory"
            aria-labelledby="current-chapter-heading"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 mt-4 px-1"
                >
                  <Skeleton className="h-8 w-1/2 mb-6" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-1"
                >
                  <h2 ref={chapterTitleRef} className="text-2xl sm:text-3xl font-semibold my-2 text-primary dark:text-sky-300" id="current-chapter-heading">
                    {selectedBook} {selectedChapter}
                  </h2>
                  {verses.length === 0 || (verses.length === 1 && verses[0].id === 'not_found') ? (
                      <p className="text-lg leading-relaxed text-muted-foreground">{t('noVerses')}</p>
                  ) : (
                      verses.map((verse, index) => (
                        <VerseDisplay
                          key={verse.id}
                          verseRef={el => verseRefs.current[verse.id] = el}
                          verse={verse}
                          index={index}
                          isSelected={selectedVerseIds.includes(verse.id)}
                          isHighlightedBySearch={verse.id === highlightedVerseId}
                          userData={verseUserData[verse.id] || {}}
                          onVerseClick={(clickedVerse, clickedIndex, event) => handleVerseClick(clickedVerse, clickedIndex, event, verses)}
                          onVerseInteraction={handleVerseContextMenu}
                          onTagClick={handleTagClick}
                          showTags={showTags}
                        />
                      ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {radialMenuState.isOpen && (
            <RadialMenu
              x={radialMenuState.x}
              y={radialMenuState.y}
              onAction={handleRadialAction}
              onClose={closeRadialMenu}
              verseId={radialMenuState.verseId}
              verseUserData={verseUserData[radialMenuState.verseId] || {}}
            />
          )}
        </AnimatePresence>

        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          verseId={currentNoteData.verseId}
          initialNote={currentNoteData.text}
          onSaveNote={handleSaveNote}
        />
        
        {isTagModalOpen && activeTagData.tagName && (
            <TagModal
                isOpen={isTagModalOpen}
                onClose={() => setIsTagModalOpen(false)}
                tagName={activeTagData.tagName}
                currentVerseId={activeTagData.verseId}
                onVerseClick={(book, chapter, verseNumber) => {
                  jumpToVerse(book, chapter.toString(), verseNumber);
                  setIsTagModalOpen(false);
                }}
            />
        )}
        </>
      );
    };

    export default ScripturePane;
