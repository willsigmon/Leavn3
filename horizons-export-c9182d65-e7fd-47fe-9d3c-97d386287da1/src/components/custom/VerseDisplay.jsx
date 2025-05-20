import React from 'react';
    import { motion } from 'framer-motion';
    import { Tag as TagIconLucide, StickyNote, Palette } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { cn } from '@/lib/utils';
    import { useLocalization } from '@/hooks/useLocalization';
    import { getTagStyles } from '@/lib/tagStyles';

    const VerseTag = ({ tag, onClick }) => {
      const { t } = useLocalization();
      const { name, type } = tag;
      const { bgColor, textColor, borderColor, hoverBgColor, darkBgColor, darkTextColor, darkBorderColor, darkHoverBgColor } = getTagStyles(type);

      return (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-auto py-0.5 px-2 text-xs rounded-full mr-1 mb-1 transition-colors",
            bgColor,
            textColor,
            borderColor,
            hoverBgColor,
            darkBgColor,
            darkTextColor,
            darkBorderColor,
            darkHoverBgColor
          )}
          onClick={onClick}
          aria-label={`${t('tagLabel')} ${name}`}
        >
          <TagIconLucide className="h-3 w-3 mr-1 opacity-80" />
          {name}
        </Button>
      );
    };
    
    const getHighlightClass = (color) => {
      switch (color) {
        case 'yellow': return 'bg-yellow-400/40 dark:bg-yellow-600/40';
        case 'green': return 'bg-green-400/40 dark:bg-green-600/40';
        case 'pink': return 'bg-pink-400/40 dark:bg-pink-600/40';
        default: return '';
      }
    };

    const VerseDisplay = ({
      verse,
      index,
      isSelected,
      isHighlightedBySearch,
      userData,
      onVerseClick,
      onVerseInteraction,
      onTagClick,
      verseRef,
      showTags
    }) => {
      const { t } = useLocalization();
      const highlightClass = getHighlightClass(userData.highlight);

      return (
        <div 
          ref={verseRef}
          className={cn(
            "snap-start relative mb-3", 
            isHighlightedBySearch && "rounded-lg" 
          )}
          onContextMenu={(e) => onVerseInteraction(e, verse.id)}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className={cn(
                "text-lg leading-relaxed px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 ease-in-out relative text-foreground dark:text-gray-200",
                "hover:bg-primary/10 dark:hover:bg-sky-800/20",
                isSelected 
                  ? "bg-primary/20 dark:bg-sky-700/40 ring-1 ring-primary dark:ring-sky-500" 
                  : "", 
                highlightClass,
                isHighlightedBySearch && "ring-2 ring-offset-2 ring-offset-background dark:ring-offset-card ring-sky-500"
            )}
            onClick={(e) => onVerseClick(verse, index, e)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onVerseClick(verse, index, e);}}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`${t('verseLabel')} ${verse.number}: ${verse.text.substring(0, 50)}... ${t('clickToSelectVerse')}`}
            aria-describedby="current-chapter-heading"
          >
            <span className={cn(
                "font-semibold mr-1.5",
                isSelected ? "text-primary dark:text-sky-200" : "text-primary/80 dark:text-sky-400/80"
            )}>{verse.number}</span>
            {verse.text}
            {userData.note && (
              <StickyNote className="h-4 w-4 text-amber-500 dark:text-amber-400 inline-block ml-2 absolute top-1.5 right-1.5" aria-label={t('noteIndicator')} />
            )}
             {userData.highlight && (
              <Palette className="h-4 w-4 text-purple-500 dark:text-purple-400 inline-block ml-2 absolute top-1.5 right-7" aria-label={t('highlightIndicator')} />
            )}
          </motion.p>
          {showTags && verse.tags && verse.tags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 flex flex-wrap pl-3"
          >
              {verse.tags.map(tagObj => (
                <VerseTag key={`${tagObj.name}-${tagObj.type}`} tag={tagObj} onClick={() => onTagClick(tagObj.name, verse.id)} />
              ))}
          </motion.div>
          )}
        </div>
      );
    };

    export default VerseDisplay;