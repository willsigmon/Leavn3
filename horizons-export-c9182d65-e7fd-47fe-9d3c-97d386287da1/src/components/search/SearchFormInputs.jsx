import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Label } from '@/components/ui/label';
    import { motion } from 'framer-motion';
    import { useLocalization } from '@/hooks/useLocalization';
    import { SearchCode as SearchIcon, Loader2, Settings2 } from 'lucide-react';

    const SearchFormInputs = ({
      formState,
      formHandlers,
      isLoading,
      onSubmit,
    }) => {
      const { t } = useLocalization();
      const {
        searchTerm, selectedVersion, searchRange, searchType,
        caseSensitive, wholeWord, selectedBooks, availableBooks,
        bookColumns, booksPerColumn, showAdvanced, displayFormat
      } = formState;

      const {
        setSearchTerm, setSelectedVersion, setSearchRange, setSearchType,
        setCaseSensitive, setWholeWord, handleBookSelection, clearSelectedBooks, selectAllBooks,
        setShowAdvanced, setDisplayFormat
      } = formHandlers;

      return (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder={t('enterSearchTermPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-lg p-4 pr-16 rounded-full shadow-inner border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-600 hover:from-sky-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(prev => !prev)}
              className="text-sm text-primary hover:text-primary/80"
            >
              <Settings2 className="h-4 w-4 mr-2" />
              {showAdvanced ? t('hideAdvancedOptions') : t('showAdvancedOptions')}
            </Button>
          </div>
          
          {showAdvanced && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 border p-4 rounded-lg bg-card/50 shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-end">
                <div>
                  <Label htmlFor="searchType" className="text-sm font-medium text-muted-foreground">{t('searchType')}</Label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger id="searchType" className="mt-1 rounded-lg shadow-sm">
                      <SelectValue placeholder={t('selectSearchTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keyword">{t('keyword')}</SelectItem>
                      <SelectItem value="phrase">{t('exactPhrase')}</SelectItem>
                      <SelectItem value="strongs">{t('strongsNumber')}</SelectItem>
                      <SelectItem value="verse_reference">{t('verseReference')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="searchRange" className="text-sm font-medium text-muted-foreground">{t('searchRange')}</Label>
                  <Select value={searchRange} onValueChange={setSearchRange}>
                    <SelectTrigger id="searchRange" className="mt-1 rounded-lg shadow-sm">
                      <SelectValue placeholder={t('selectSearchRangePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allBooks')}</SelectItem>
                      <SelectItem value="ot">{t('oldTestament')}</SelectItem>
                      <SelectItem value="nt">{t('newTestament')}</SelectItem>
                      <SelectItem value="specific_books">{t('specificBooks')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-end">
                <div>
                    <Label htmlFor="selectedVersion" className="text-sm font-medium text-muted-foreground">{t('bibleVersion')}</Label>
                    <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                      <SelectTrigger id="selectedVersion" className="mt-1 rounded-lg shadow-sm">
                        <SelectValue placeholder={t('selectVersionPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KJV">KJV (King James Version)</SelectItem>
                        <SelectItem value="WEB">WEB (World English Bible)</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div>
                  <Label htmlFor="displayFormat" className="text-sm font-medium text-muted-foreground">{t('displayFormat')}</Label>
                  <Select value={displayFormat} onValueChange={setDisplayFormat}>
                    <SelectTrigger id="displayFormat" className="mt-1 rounded-lg shadow-sm">
                      <SelectValue placeholder={t('selectDisplayFormatPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verse">{t('verseByVerse')}</SelectItem>
                      <SelectItem value="paragraph">{t('paragraphStyle')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {searchRange === 'specific_books' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 p-4 border rounded-lg bg-background/30 shadow"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-muted-foreground">{t('selectBooksToSearch')}</h4>
                    <div className="space-x-2">
                      <Button type="button" variant="link" size="sm" onClick={selectAllBooks}>{t('selectAll')}</Button>
                      <Button type="button" variant="link" size="sm" onClick={clearSelectedBooks}>{t('deselectAll')}</Button>
                    </div>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${bookColumns > 0 ? bookColumns : 1} gap-x-4 gap-y-2 max-h-60 overflow-y-auto pretty-scrollbar p-2 rounded-md`}>
                    {Array.from({ length: bookColumns > 0 ? bookColumns : 1 }).map((_, colIndex) => (
                      <div key={colIndex} className="flex flex-col space-y-1">
                        {availableBooks
                          .slice(colIndex * booksPerColumn, (colIndex + 1) * booksPerColumn)
                          .map(book => (
                            <div key={book.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`book-${book.id}`}
                                checked={selectedBooks.includes(book.id)}
                                onCheckedChange={() => handleBookSelection(book.id)}
                              />
                              <Label htmlFor={`book-${book.id}`} className="text-sm font-normal cursor-pointer hover:text-primary transition-colors">
                                {book.name}
                              </Label>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex flex-wrap gap-4 items-center pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="caseSensitive" checked={caseSensitive} onCheckedChange={setCaseSensitive} />
                  <Label htmlFor="caseSensitive" className="text-sm font-medium text-muted-foreground cursor-pointer">{t('caseSensitive')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="wholeWord" checked={wholeWord} onCheckedChange={setWholeWord} />
                  <Label htmlFor="wholeWord" className="text-sm font-medium text-muted-foreground cursor-pointer">{t('wholeWordOnly')}</Label>
                </div>
              </div>
            </motion.div>
          )}
        </form>
      );
    };

    export default SearchFormInputs;
