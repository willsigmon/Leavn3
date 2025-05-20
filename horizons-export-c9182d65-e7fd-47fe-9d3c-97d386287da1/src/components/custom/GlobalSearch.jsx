import React, { useRef, useState, useEffect } from 'react';
    import { Search as SearchIcon } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import { useLocalization } from '@/hooks/useLocalization';
    import { cn } from '@/lib/utils';

    const GlobalSearch = ({ onSearchSubmit }) => {
      const { t } = useLocalization();
      const [searchQuery, setSearchQuery] = useState('');
      const [isFocused, setIsFocused] = useState(false);
      const searchInputRef = useRef(null);

      const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
      };

      const handleSearchFormSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          onSearchSubmit(searchQuery.trim());
        }
      };

      useEffect(() => {
        const handleKeyDown = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            searchInputRef.current?.focus();
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, []);

      return (
        <form onSubmit={handleSearchFormSubmit} className="relative flex-grow max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg mx-2 sm:mx-4">
          <SearchIcon
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors",
              isFocused && "text-primary dark:text-sky-400"
            )}
          />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder={t('searchBiblePlaceholder')}
            className={cn(
              "w-full rounded-2xl pl-10 pr-3 py-2 h-9 text-sm transition-all duration-300 ease-in-out",
              "bg-background/70 dark:bg-slate-800/70 focus:bg-background dark:focus:bg-slate-700/90",
              "text-foreground dark:text-gray-200 placeholder:text-muted-foreground dark:placeholder:text-gray-500",
              isFocused ? "shadow-md ring-1 ring-primary/50 dark:ring-sky-500/50" : "hover:bg-background/90 dark:hover:bg-slate-800/90"
            )}
            aria-label={t('searchBible')}
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </form>
      );
    };

    export default GlobalSearch;