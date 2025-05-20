import React, { useState, useEffect, useRef } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { cn } from '@/lib/utils';
    import { useLocalization } from '@/hooks/useLocalization';
    import CompanionPreferences from '@/components/custom/CompanionPreferences';
    import CompanionContent from '@/components/custom/CompanionContent';
    import { Settings, MessageSquare as DefaultMessageSquareTextIcon, Library, Info } from 'lucide-react'; 
    import { Button } from '@/components/ui/button';


    const CompanionSidebar = ({ 
        selectedVerseObjects, 
        isMobile, 
        allLoadedBookData, 
        selectedTranslation,
        generationalTone,
        setGenerationalTone,
        theologicalViewpoint,
        setTheologicalViewpoint,
        denomination,
        setDenomination,
        currentChapterVerses
    }) => {
      const { t } = useLocalization();
      const [isOpen, setIsOpen] = useState(!isMobile); 
      const [sheetSnap, setSheetSnap] = useState(0.3); 
      const dragControlsRef = useRef(null);
      const [activeTab, setActiveTab] = useState('content'); 

      const sheetVariants = {
        closed: { y: "100%", transition: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 } },
        open: (customSnap) => ({ y: `${100 - customSnap * 100}%`, transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } }),
      };
      
      const desktopVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 }
      };

      useEffect(() => {
        if (isMobile) {
          setIsOpen(false); 
          setSheetSnap(0.3); 
        } else {
          setIsOpen(true);
        }
      }, [isMobile]);
      
      const handleDragEnd = (event, info) => {
        const dragThreshold = 50; 
        const velocityThreshold = 200;

        if (info.offset.y > dragThreshold || info.velocity.y > velocityThreshold) { 
          if (sheetSnap === 1) setSheetSnap(0.6);
          else if (sheetSnap === 0.6) setSheetSnap(0.3);
          else setIsOpen(false); 
        } else if (info.offset.y < -dragThreshold || info.velocity.y < -velocityThreshold) { 
          if (sheetSnap === 0.3) setSheetSnap(0.6);
          else if (sheetSnap === 0.6) setSheetSnap(1);
          else if (sheetSnap === 1) {} 
          else setSheetSnap(0.6); 
        } else { 
          
        }
      };
      
      const toggleSheet = () => {
        if (!isOpen) {
            setIsOpen(true);
            setSheetSnap(0.3); 
        } else {
            if (sheetSnap === 0.3) setSheetSnap(0.6);
            else if (sheetSnap === 0.6) setSheetSnap(1);
            else if (sheetSnap === 1) setIsOpen(false); 
            else setIsOpen(false); 
        }
      };


      const currentHeight = isMobile ? `${sheetSnap * 100}vh` : 'auto';
      
      const preferences = { generationalTone, theologicalViewpoint, denomination };


      const SidebarContent = () => (
        <>
          {isMobile && (
            <div className="p-2 border-b border-border/50 dark:border-border/20">
              <div className="flex justify-around">
                <Button variant={activeTab === 'content' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('content')} className="text-xs h-8 px-3 w-1/2 flex items-center gap-1.5">
                  <Info className="h-4 w-4 opacity-80" /> {t('insights')}
                </Button>
                <Button variant={activeTab === 'preferences' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('preferences')} className="text-xs h-8 px-3 w-1/2 flex items-center gap-1.5">
                   <Settings className="h-4 w-4 opacity-80" /> {t('preferences')}
                </Button>
              </div>
            </div>
          )}
          <ScrollArea className="flex-grow p-3 sm:p-4">
            {(activeTab === 'preferences' || !isMobile) && (
              <CompanionPreferences 
                generationalTone={generationalTone}
                setGenerationalTone={setGenerationalTone}
                theologicalViewpoint={theologicalViewpoint}
                setTheologicalViewpoint={setTheologicalViewpoint}
                denomination={denomination}
                setDenomination={setDenomination}
              />
            )}
            {(activeTab === 'content' || !isMobile) && (
              <CompanionContent 
                selectedVerseObjects={selectedVerseObjects}
                allLoadedBookData={allLoadedBookData}
                selectedTranslation={selectedTranslation}
                currentChapterVerses={currentChapterVerses}
                preferences={preferences}
              />
            )}
          </ScrollArea>
        </>
      );

      if (isMobile) {
        return (
          <>
            {!isOpen && (
              <motion.button
                onClick={toggleSheet}
                className="fixed bottom-4 right-4 z-[60] bg-primary text-primary-foreground p-3 rounded-full shadow-lg flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                aria-label={t('openStudyToolsPanel')}
              >
                <DefaultMessageSquareTextIcon className="h-6 w-6" />
              </motion.button>
            )}
            <AnimatePresence>
            {isOpen && (
              <motion.div
                drag="y"
                onDragEnd={handleDragEnd}
                dragListener={false} 
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.05, bottom: 0.4 }}
                variants={sheetVariants}
                initial="closed"
                animate={"open"}
                custom={sheetSnap}
                exit="closed"
                className={cn(
                  "fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-2xl mx-auto",
                  "touch-action-pan-y" 
                )}
                style={{ 
                  height: currentHeight
                }} 
              >
                <motion.div 
                  ref={dragControlsRef}
                  className="py-3 px-4 flex justify-center items-center cursor-grab active:cursor-grabbing"
                  style={{ touchAction: 'none' }} 
                >
                  <div className="w-10 h-1.5 bg-muted-foreground/50 rounded-full" />
                </motion.div>
                <SidebarContent />
              </motion.div>
            )}
            </AnimatePresence>
          </>
        );
      }

      return (
        <motion.div
          variants={desktopVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.5 }}
          className="w-full max-w-md lg:w-1/3 xl:w-1/4 flex flex-col glass-card"
          aria-label={t('studyToolsSidebar')}
        >
          <div className="p-4 border-b border-border/50 dark:border-border/20 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary dark:text-sky-400 flex items-center gap-2">
                <Library className="h-5 w-5 opacity-90" />
                {t('studyToolsTitle')}
            </h2>
          </div>
          <SidebarContent />
        </motion.div>
      );
    };
    
    export default CompanionSidebar;