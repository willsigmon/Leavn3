import React, { useState, useEffect, useCallback } from 'react';
    import { MapPinned, Lightbulb, BookOpenText, Tags, History, Users } from 'lucide-react';
    import MiniMap from '@/components/custom/MiniMap';
    import ShimmerLoading from '@/components/custom/ShimmerLoading';
    import AccordionSection from '@/components/custom/AccordionSection';
    import { useLocalization } from '@/hooks/useLocalization';
    import { verseDataManager } from '@/lib/verseDataManager';
    import { Button } from '@/components/ui/button';

    const isValidVerseId = (verseId) => {
      if (!verseId || typeof verseId !== 'string') return false;
      const parts = verseId.split('_');
      return parts.length === 4 && !isNaN(parseInt(parts[2])) && !isNaN(parseInt(parts[3]));
    };
    
    const CompanionContent = ({ 
      selectedVerseObjects, 
      allLoadedBookData, 
      selectedTranslation, 
      currentChapterVerses,
      preferences 
    }) => {
      const { t } = useLocalization();
      
      const initialOpenSections = ['aiInsights', 'maps', 'commentaries', 'crossReferences', 'historicalContext', 'keyFigures'];
      const [openSections, setOpenSections] = useState(initialOpenSections);
      
      const [contentData, setContentData] = useState({
        aiInsights: {}, maps: {}, commentaries: {}, crossReferences: {}, historicalContext: {}, keyFigures: {},
      });
      const [isLoading, setIsLoading] = useState({
        aiInsights: false, maps: false, commentaries: false, crossReferences: false, historicalContext: false, keyFigures: false,
      });

      const setLoadingState = (section, isLoadingVal) => setIsLoading(prev => ({ ...prev, [section]: isLoadingVal }));
      const setSectionData = (section, verseId, data) => setContentData(prev => ({
        ...prev, [section]: { ...prev[section], [verseId]: data },
      }));
      const clearSectionData = (section) => setContentData(prev => ({ ...prev, [section]: {} }));

      const loadDataForVerse = useCallback(async (verse) => {
        if (!verse || !verse.id || !isValidVerseId(verse.id)) {
            console.warn("Attempted to load data for invalid verse:", verse);
            return;
        }
        const { id: verseId, text: verseText } = verse;
        const verseTags = verse.tags || []; // Ensure verseTags is an array

        const sectionsToLoad = [
          { name: 'aiInsights', fetcher: verseDataManager.getAiInsights, args: [verseId, verseText, selectedTranslation, preferences] },
          { name: 'maps', fetcher: verseDataManager.getMapData, args: [verseId] },
          { name: 'commentaries', fetcher: verseDataManager.getCommentaries, args: [verseId] },
          { name: 'crossReferences', fetcher: verseDataManager.getCrossReferences, args: [verseId] },
          { name: 'historicalContext', fetcher: verseDataManager.getHistoricalContext, args: [verseId] },
          { name: 'keyFigures', fetcher: verseDataManager.getKeyFigures, args: [verseId] },
        ];

        sectionsToLoad.forEach(section => {
          setLoadingState(section.name, true);
          section.fetcher(...section.args)
            .then(data => setSectionData(section.name, verseId, data))
            .catch(error => {
                console.error(`Error loading ${section.name} for ${verseId}:`, error);
                setSectionData(section.name, verseId, { error: `Failed to load ${section.name}` });
            })
            .finally(() => setLoadingState(section.name, false));
        });

      }, [selectedTranslation, preferences]);


      const preloadNextVerses = useCallback((currentIndex, count = 3) => {
        if (!currentChapterVerses || currentChapterVerses.length === 0) return;
        for (let i = 1; i <= count; i++) {
          const nextVerseIndex = currentIndex + i;
          if (nextVerseIndex < currentChapterVerses.length) {
            const nextVerse = currentChapterVerses[nextVerseIndex];
            if (nextVerse && nextVerse.id && isValidVerseId(nextVerse.id)) {
              verseDataManager.getAiInsights(nextVerse.id, nextVerse.text, selectedTranslation, preferences).catch(e => console.warn("Preload AI failed", e));
              verseDataManager.getCommentaries(nextVerse.id, selectedTranslation).catch(e => console.warn("Preload Comm failed", e));
            }
          } else break;
        }
      }, [currentChapterVerses, selectedTranslation, preferences]);

      useEffect(() => {
        const validSelectedVerseObjects = selectedVerseObjects.filter(verse => verse && verse.id && isValidVerseId(verse.id));

        if (validSelectedVerseObjects && validSelectedVerseObjects.length > 0) {
          Object.keys(contentData).forEach(section => clearSectionData(section));
          validSelectedVerseObjects.forEach(verse => loadDataForVerse(verse));
          
          const lastSelectedVerse = validSelectedVerseObjects[validSelectedVerseObjects.length - 1];
          if (lastSelectedVerse && currentChapterVerses) {
            const lastSelectedIndex = currentChapterVerses.findIndex(v => v.id === lastSelectedVerse.id);
            if (lastSelectedIndex !== -1) preloadNextVerses(lastSelectedIndex);
          }
        } else {
          Object.keys(contentData).forEach(section => clearSectionData(section));
          Object.keys(isLoading).forEach(section => setLoadingState(section, false));
        }
      }, [selectedVerseObjects, loadDataForVerse, preloadNextVerses, currentChapterVerses]);

      const toggleAccordion = (sectionName) => setOpenSections(prev =>
        prev.includes(sectionName) ? prev.filter(s => s !== sectionName) : [...prev, sectionName]
      );
      
      const parseVerseIdForDisplay = (verseId) => {
        if (!isValidVerseId(verseId)) return { book: 'N/A', chapter: '', verse: '' };
        const parts = verseId.split('_');
        return {
            book: parts[1],
            chapter: parts[2],
            verse: parts[3]
        };
      };

      const getSectionTitle = () => {
        const validSelectedVerses = selectedVerseObjects.filter(v => isValidVerseId(v.id));
        if (!validSelectedVerses || validSelectedVerses.length === 0) return t('verseDetails');
        
        const firstVerseDetails = parseVerseIdForDisplay(validSelectedVerses[0].id);
        let title = `${t('insightsFor')} ${firstVerseDetails.book} ${firstVerseDetails.chapter}:${firstVerseDetails.verse}`;
        if (validSelectedVerses.length > 1) title += ` (+${validSelectedVerses.length -1})`;
        return title;
      };

      const renderItems = (items, sectionName) => {
         if (!items || items.length === 0) {
            return <p className="text-xs text-muted-foreground">{t(`noDataAvailableFor${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`)}</p>;
         }

        if (sectionName === 'commentaries') {
          return items.map((commentaryArray, verseIndex) => (
            Array.isArray(commentaryArray) ? commentaryArray.map((commentary, itemIndex) => (
              commentary.error ? <p key={`${verseIndex}-${itemIndex}-error`} className="text-xs text-red-500">{commentary.error}</p> :
              <div key={`${verseIndex}-${itemIndex}`} className="mb-2">
                <p className="font-semibold text-xs text-foreground/90 dark:text-foreground/80">{commentary.source_name || 'Unknown Source'}</p>
                <p className="whitespace-pre-wrap text-xs">{commentary.commentary_text || 'No text.'}</p>
              </div>
            )) : <p key={`${verseIndex}-invalid`} className="text-xs text-red-500">{t('invalidCommentaryData')}</p>
          ));
        }
        if (sectionName === 'crossReferences') {
            return items.map((crossRefArray, verseIndex) => (
                Array.isArray(crossRefArray) ? crossRefArray.map((refItem, itemIndex) => (
                   refItem.error ? <p key={`${verseIndex}-${itemIndex}-error`} className="text-xs text-red-500">{refItem.error}</p> :
                    <Button variant="link" key={`${verseIndex}-${itemIndex}`} className="p-0 h-auto text-xs text-primary dark:text-sky-400 mr-2 mb-1 hover:underline">
                        {refItem.target_verse_id || 'N/A'}
                    </Button>
                )) : <p key={`${verseIndex}-invalid`} className="text-xs text-red-500">{t('invalidCrossRefData')}</p>
            ));
        }
         if (sectionName === 'keyFigures') {
          return items.map((figureArray, verseIndex) => (
            Array.isArray(figureArray) ? figureArray.map((figure, itemIndex) => (
              figure.error ? <p key={`${verseIndex}-${itemIndex}-error`} className="text-xs text-red-500">{figure.description}</p> :
              <div key={`${verseIndex}-${itemIndex}`} className="mb-2">
                <p className="font-semibold text-xs">{figure.figure_name}</p>
                <p className="text-xs text-muted-foreground">{figure.description}</p>
              </div>
            )) : <p key={`${verseIndex}-invalid`} className="text-xs text-red-500">{t('invalidKeyFigureData')}</p>
          ));
        }
         if (sectionName === 'historicalContext') {
            return items.map((contextItem, index) => (
                contextItem && contextItem.error ? <p key={`${index}-error`} className="text-xs text-red-500">{contextItem.error}</p> :
                <p key={index} className="whitespace-pre-wrap mb-2 text-xs">
                    {contextItem?.context_text || (typeof contextItem === 'string' ? contextItem : t('noHistoricalContext'))}
                </p>
            ));
         }
        
        return items.map((item, index) => (
          item && item.error ? <p key={`${index}-error`} className="text-xs text-red-500">{item.error}</p> :
          <p key={index} className="whitespace-pre-wrap mb-2 text-xs">
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </p>
        ));
      }

      const renderContentForSection = (sectionName) => {
        const currentSectionIsLoading = isLoading[sectionName];
        const validSelectedVerseObjects = selectedVerseObjects.filter(verse => verse && verse.id && isValidVerseId(verse.id));

        const sectionItems = validSelectedVerseObjects
            .map(verse => contentData[sectionName]?.[verse.id])
            .filter(Boolean); // Filter out undefined/null which can happen if data hasn't loaded

        if (currentSectionIsLoading && sectionItems.length === 0) {
          return <ShimmerLoading className="my-1 h-10" count={2}/>;
        }
        if (!validSelectedVerseObjects || validSelectedVerseObjects.length === 0) {
          return <p className="text-xs text-muted-foreground">{t(`noVerseSelectedFor${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`)}</p>;
        }
        return renderItems(sectionItems, sectionName);
      };
      
      const firstMapLocation = selectedVerseObjects.length > 0 
        ? Object.values(contentData.maps).find(loc => loc && loc.lat && loc.lon && !loc.error) 
        : null;

      const sectionsConfig = [
        { name: 'aiInsights', title: t('aiInsights'), icon: <Lightbulb />, content: renderContentForSection('aiInsights')},
        { name: 'maps', title: t('maps'), icon: <MapPinned />, content: isLoading.maps && !firstMapLocation ? <ShimmerLoading className="my-1 h-32" /> : 
             firstMapLocation ? <MiniMap latitude={firstMapLocation.lat} longitude={firstMapLocation.lon} zoom={firstMapLocation.zoom} /> : 
             <p className="text-xs text-muted-foreground">{selectedVerseObjects?.filter(v => isValidVerseId(v.id)).length > 0 ? t('noLocationData') : t('noVerseSelectedForMap')}</p> },
        { name: 'commentaries', title: t('commentaries'), icon: <BookOpenText />, content: renderContentForSection('commentaries') },
        { name: 'crossReferences', title: t('crossReferences'), icon: <Tags />, content: renderContentForSection('crossReferences') },
        { name: 'historicalContext', title: t('historicalContext'), icon: <History />, content: renderContentForSection('historicalContext') },
        { name: 'keyFigures', title: t('keyFigures'), icon: <Users />, content: renderContentForSection('keyFigures') },
      ];

      return (
        <div className="mt-0 space-y-0">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 mt-1 px-1">
                {getSectionTitle()}
            </h3>
          
          {sectionsConfig.map(section => (
            <AccordionSection
              key={section.name}
              title={section.title}
              icon={section.icon}
              sectionName={section.name}
              isOpen={openSections.includes(section.name)}
              onToggle={toggleAccordion}
            >
              {section.content}
            </AccordionSection>
          ))}
        </div>
      );
    };

    export default CompanionContent;
