import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { useLocalization } from '@/hooks/useLocalization';
    import { BookOpen, Loader2 } from 'lucide-react';

    const SearchResultsList = ({ results, isLoading, error, highlightFunction }) => {
      const { t } = useLocalization();
      const navigate = useNavigate();

      if (isLoading && results.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center text-muted-foreground py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">{t('searchingInProgress')}</p>
          </div>
        );
      }

      if (!isLoading && results.length === 0 && !error) {
        return (
          <div className="text-center text-muted-foreground py-10">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">{t('noResultsMessage')}</p>
            <p className="text-sm">{t('tryDifferentKeywords')}</p>
          </div>
        );
      }
      
      return (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pretty-scrollbar pr-2">
          {results.map((result, index) => (
            <motion.div
              key={`${result.reference}-${result.version}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-background/40 hover:bg-background/70"
              onClick={() => {
                const [book, chapterAndVerse] = result.reference.split(/\s+(?=\d)/);
                if (book && chapterAndVerse) {
                    const [chapter, verse] = chapterAndVerse.split(':');
                    navigate(`/?book=${book.trim()}&chapter=${chapter}&verse=${verse}`);
                } else {
                    console.warn("Could not parse reference for navigation:", result.reference);
                }
              }}
            >
              <p className="font-semibold text-primary">{result.reference} ({result.version})</p>
              <p 
                className="text-sm text-foreground/80 mt-1" 
                dangerouslySetInnerHTML={{ __html: highlightFunction(result.text) }} 
              />
              {result.context && <p className="text-xs text-muted-foreground mt-2 italic">Context: "{result.context}"</p>}
              {result.exactMatch && <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full ml-2">Exact Match</span>}
              {result.strongsMatch && <span className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full ml-2">Strongs Match</span>}
            </motion.div>
          ))}
        </div>
      );
    };

    export default SearchResultsList;