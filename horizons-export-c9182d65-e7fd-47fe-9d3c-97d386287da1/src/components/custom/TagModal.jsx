import React, { useState, useEffect } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Tag, BookOpen, Lightbulb } from 'lucide-react';
    import ShimmerLoading from '@/components/custom/ShimmerLoading';
    import { useToast } from "@/components/ui/use-toast";
    import { useLocalization } from '@/hooks/useLocalization';

    const TagModal = ({ isOpen, onClose, tagName, currentVerseId, onVerseClick }) => {
      const { t } = useLocalization();
      const [tagDetails, setTagDetails] = useState(null);
      const [insights, setInsights] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      useEffect(() => {
        if (isOpen && tagName && currentVerseId) {
          const fetchMockTagData = async () => {
            setIsLoading(true);
            setTagDetails(null);
            setInsights([]);
            
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
              const [translation, book, chapter, verseNum] = currentVerseId.split('_');
              const mockData = {
                tagName: tagName,
                explanation: `${t('explanationForTag', {tagName})} ${t('specificallyRelatedToVerse', {book, chapter, verseNum})}. ${t('tagSignifiesThemes', {tagName: tagName.toLowerCase()})}.`,
                relatedVerses: [
                  { id: `${translation}_Genesis_1_1`, text: "In the beginning God created the heaven and the earth." },
                  { id: `${translation}_John_1_3`, text: "All things were made by him; and without him was not any thing made that was made." },
                  { id: `${translation}_Psalms_19_1`, text: "The heavens declare the glory of God; and the firmament sheweth his handywork." }
                ].filter(v => v.id !== currentVerseId && Math.random() > 0.3).slice(0, 2), 
                insights: [
                  `${t('conceptOfTagFundamental', {tagName})}`,
                  `${t('considerTagInteraction', {tagName, book, chapter})}`,
                  `${t('tagLinksToBroaderDiscussions', {tagName, book, chapter, verseNum})}`,
                  `${t('exploringTagRevealsDeeperMeaning', {tagName})}`,
                  `${t('historicalContextShedsLight', {tagName})}`
                ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2)
              };

              setTagDetails({
                tagName: mockData.tagName,
                explanation: mockData.explanation, 
                relatedVerses: mockData.relatedVerses
              });
              setInsights(mockData.insights);

            } catch (error) {
              console.error("Error generating mock tag data:", error);
              toast({
                title: t('tagErrorTitle'),
                description: error.message || t('tagErrorDescription'),
                variant: "destructive",
              });
              setTagDetails({ tagName, explanation: t('noTagDetails'), relatedVerses: [] });
            } finally {
              setIsLoading(false);
            }
          };
          fetchMockTagData();
        }
      }, [isOpen, tagName, currentVerseId, toast, t]);

      if (!isOpen) return null;

      const handleRelatedVerseClick = (verseId) => {
        const [_translation, book, chapter, verseNum] = verseId.split('_');
        onVerseClick(book, chapter, parseInt(verseNum));
        onClose();
      };

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[525px] glass-card p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center text-2xl text-primary dark:text-sky-300">
                <Tag className="mr-2 h-6 w-6" />
                {t('tagModalTitle', { tagName })}
              </DialogTitle>
              {isLoading && !tagDetails && (
                <DialogDescription className="mt-2 text-muted-foreground dark:text-gray-400">
                  {t('loadingTagInfo', { tagName })}
                </DialogDescription>
              )}
              {tagDetails && (
                <DialogDescription className="mt-2 text-muted-foreground dark:text-gray-400">
                  {t('exploreTagInsights', { tagName })}
                </DialogDescription>
              )}
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh] my-4 pr-3 scrollbar-thin">
              {isLoading && <ShimmerLoading lines={5} className="p-1" />}
              {!isLoading && tagDetails && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-foreground dark:text-gray-200">{t('explanation')}</h3>
                    <p className="text-sm text-foreground dark:text-gray-300 leading-relaxed">
                      {tagDetails.explanation}
                    </p>
                  </div>

                  {insights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center text-foreground dark:text-gray-200">
                        <Lightbulb className="h-5 w-5 mr-2 text-amber-500 dark:text-amber-400" />
                        {t('keyInsights')}
                      </h3>
                      <ul className="space-y-1.5 list-disc list-inside pl-1">
                        {insights.map((insight, index) => (
                          <li key={index} className="text-sm text-foreground dark:text-gray-300">
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tagDetails.relatedVerses && tagDetails.relatedVerses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-gray-200">{t('relatedVerses')}</h3>
                      <ul className="space-y-2">
                        {tagDetails.relatedVerses.map((verse) => {
                          const [_tr, book, chap, num] = verse.id.split('_');
                          return (
                            <li key={verse.id} 
                                className="p-3 rounded-lg bg-background/50 dark:bg-slate-800/60 hover:bg-primary/5 dark:hover:bg-primary-foreground/5 transition-colors cursor-pointer"
                                onClick={() => handleRelatedVerseClick(verse.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRelatedVerseClick(verse.id);}}
                                aria-label={`${t('goToVerse')} ${book} ${chap}:${num}`}
                            >
                              <div className="flex items-center text-sm font-medium text-primary dark:text-sky-400 mb-0.5">
                                <BookOpen className="h-4 w-4 mr-2 opacity-70" />
                                {book} {chap}:{num}
                              </div>
                              <p className="text-xs text-muted-foreground dark:text-gray-400">{verse.text}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {!isLoading && !tagDetails && (
                <p className="text-muted-foreground dark:text-gray-400 text-center py-4">{t('noTagDetails')}</p>
              )}
            </ScrollArea>

            <DialogFooter className="mt-2">
              <Button onClick={onClose} variant="outline" className="rounded-xl">{t('close')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default TagModal;
