import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { ChevronLeft, ChevronRight, BookOpenText, Tags, Settings, Search } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useLocalization } from '@/hooks/useLocalization';

    const ScripturePaneHeader = ({
      selectedTranslation,
      setSelectedTranslation,
      selectedBook,
      setSelectedBook,
      selectedChapter,
      setSelectedChapter,
      chapters,
      bibleBooks,
      showTags,
      setShowTags,
      onToggleTools,
    }) => {
      const { t } = useLocalization();

      const handlePreviousChapter = () => {
        const currentChapterIndex = chapters.indexOf(selectedChapter);
        if (currentChapterIndex > 0) {
          setSelectedChapter(chapters[currentChapterIndex - 1]);
        }
      };

      const handleNextChapter = () => {
        const currentChapterIndex = chapters.indexOf(selectedChapter);
        if (currentChapterIndex < chapters.length - 1) {
          setSelectedChapter(chapters[currentChapterIndex + 1]);
        }
      };

      const handleBookChange = (bookName) => {
        setSelectedBook(bookName);
        setSelectedChapter('1'); 
      };
      
      const handleChapterChange = (chapterNumber) => {
        setSelectedChapter(chapterNumber);
      };

      const MotionButton = motion(Button);

      return (
        <div className="p-3 sm:p-4 bg-background/70 backdrop-blur-md rounded-xl shadow-lg border border-border/50 sticky top-20 sm:top-[calc(theme(spacing.24)_+_1rem)] z-30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                <SelectTrigger className="w-auto sm:w-[80px] h-9 sm:h-10 rounded-lg shadow-sm text-xs sm:text-sm" aria-label={t('selectTranslation')}>
                  <SelectValue placeholder={t('translationPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KJV">KJV</SelectItem>
                  <SelectItem value="WEB">WEB</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedBook} onValueChange={handleBookChange}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 sm:h-10 rounded-lg shadow-sm truncate text-xs sm:text-sm" aria-label={t('selectBook')}>
                  <BookOpenText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder={t('bookPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {bibleBooks.map((book) => (
                    <SelectItem key={book} value={book} className="text-xs sm:text-sm">
                      {book}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-center">
              <MotionButton 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg shadow-sm" 
                onClick={handlePreviousChapter} 
                disabled={chapters.indexOf(selectedChapter) === 0}
                whileTap={{ scale: 0.9 }}
                aria-label={t('previousChapter')}
              >
                <ChevronLeft className="h-5 w-5" />
              </MotionButton>

              <Select value={selectedChapter} onValueChange={handleChapterChange}>
                <SelectTrigger className="w-[70px] sm:w-[80px] h-9 sm:h-10 rounded-lg shadow-sm text-center font-semibold text-xs sm:text-sm" aria-label={t('selectChapter')}>
                  <SelectValue placeholder={t('chapterPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter} className="text-xs sm:text-sm">
                      {t('chapter')} {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <MotionButton 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg shadow-sm" 
                onClick={handleNextChapter} 
                disabled={chapters.indexOf(selectedChapter) === chapters.length - 1}
                whileTap={{ scale: 0.9 }}
                aria-label={t('nextChapter')}
              >
                <ChevronRight className="h-5 w-5" />
              </MotionButton>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
              <MotionButton
                variant={showTags ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg"
                onClick={() => setShowTags(prev => !prev)}
                whileTap={{ scale: 0.9 }}
                aria-label={showTags ? t('hideTags') : t('showTags')}
              >
                <Tags className="h-5 w-5" />
              </MotionButton>
              <MotionButton
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg"
                onClick={onToggleTools}
                whileTap={{ scale: 0.9 }}
                aria-label={t('toggleVerseTools')}
              >
                <Settings className="h-5 w-5" />
              </MotionButton>
              <Link to="/search">
                <MotionButton
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg"
                  whileTap={{ scale: 0.9 }}
                  aria-label={t('openSearchPage')}
                >
                  <Search className="h-5 w-5" />
                </MotionButton>
              </Link>
            </div>
          </div>
        </div>
      );
    };

    export default ScripturePaneHeader;
