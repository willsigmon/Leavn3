import React, { useState, useEffect, useMemo } from 'react';
    import { useParams, Link, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useLocalization } from '@/hooks/useLocalization';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Skeleton } from '@/components/ui/skeleton';
    import { ChevronLeft, ChevronRight, Search, Library } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const StudyReference = () => {
      const { type, book: bookSlug } = useParams();
      const navigate = useNavigate();
      const { t } = useLocalization();

      const [books, setBooks] = useState([]);
      const [selectedBookContent, setSelectedBookContent] = useState(null);
      const [isLoadingBooks, setIsLoadingBooks] = useState(true);
      const [isLoadingBookContent, setIsLoadingBookContent] = useState(false);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        const fetchBooksList = async () => {
          setIsLoadingBooks(true);
          setError(null);
          try {
            const { data, error: fetchError } = await supabase.functions.invoke('reference-type-books-handler', {
              body: JSON.stringify({ type }),
              method: 'POST',
            });
            if (fetchError) throw fetchError;
            if (data && data.error) throw new Error(data.error);
            setBooks(data.books || []);
          } catch (err) {
            console.error(`Error fetching reference books for type ${type}:`, err);
            setError(t('errorFetchingReferenceBooks') + (err.message ? `: ${err.message}` : ''));
            setBooks([]);
          } finally {
            setIsLoadingBooks(false);
          }
        };
        fetchBooksList();
      }, [type, t]);

      useEffect(() => {
        if (bookSlug) {
          fetchBookContent(bookSlug);
        } else {
          setSelectedBookContent(null);
        }
      }, [bookSlug, type, t]);

      const fetchBookContent = async (slug) => {
        setIsLoadingBookContent(true);
        setError(null);
        setSelectedBookContent(null);
        try {
          const { data, error: fetchError } = await supabase.functions.invoke('reference-type-book-handler', {
            body: JSON.stringify({ type, book: slug }),
            method: 'POST',
          });
          if (fetchError) throw fetchError;
          if (data && data.error) throw new Error(data.error);
          setSelectedBookContent(data);
        } catch (err) {
          console.error(`Error fetching content for reference book ${slug}:`, err);
          setError(t('errorFetchingReferenceContent') + (err.message ? `: ${err.message}` : ''));
          setSelectedBookContent(null);
        } finally {
          setIsLoadingBookContent(false);
        }
      };
      
      const filteredBooks = useMemo(() => {
        if (!searchTerm) return books;
        return books.filter(book =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }, [books, searchTerm]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      if (error && !isLoadingBooks && !isLoadingBookContent) {
        return <div className="text-red-500 p-4 text-center">{error}</div>;
      }

      return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6 items-start">
          <motion.aside 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/3 lg:w-1/4 space-y-4 md:sticky md:top-24"
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{t('referenceMaterials')}: {type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    placeholder={t('searchMaterials')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {isLoadingBooks ? (
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <motion.ul 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-1 max-h-[60vh] overflow-y-auto pretty-scrollbar pr-1"
                  >
                    {filteredBooks.length > 0 ? filteredBooks.map(book => (
                      <motion.li key={book.slug} variants={itemVariants}>
                        <Button
                          asChild
                          variant={bookSlug === book.slug ? 'default' : 'ghost'}
                          className="w-full justify-start"
                        >
                          <Link to={`/study/reference/${type}/${book.slug}`}>{book.title}</Link>
                        </Button>
                      </motion.li>
                    )) : <p className="text-sm text-muted-foreground">{t('noMaterialsFound')}</p>}
                  </motion.ul>
                )}
              </CardContent>
            </Card>
          </motion.aside>

          <main className="w-full md:w-2/3 lg:w-3/4">
            <AnimatePresence mode="wait">
              {isLoadingBookContent ? (
                 <motion.div
                  key="loading-ref"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="shadow-xl">
                    <CardHeader>
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-20 w-full mt-4" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : selectedBookContent ? (
                <motion.div
                  key={selectedBookContent.slug || 'ref-content'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl md:text-3xl font-bold">{selectedBookContent.title}</CardTitle>
                      {selectedBookContent.meta?.author && <CardDescription>{t('author')}: {selectedBookContent.meta.author}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      {selectedBookContent.meta?.summary && <p className="italic text-muted-foreground mb-4">{selectedBookContent.meta.summary}</p>}
                      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedBookContent.content || t('noContentAvailable') }} />
                      {selectedBookContent.meta?.source && (
                        <p className="text-xs text-muted-foreground mt-6">{t('source')}: {selectedBookContent.meta.source}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : !bookSlug && !isLoadingBooks ? (
                <motion.div
                  key="placeholder-ref"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center"
                >
                  <Library className="w-24 h-24 text-muted-foreground/30 mb-6" />
                  <h2 className="text-2xl font-semibold text-muted-foreground mb-2">{t('selectReferenceMaterial')}</h2>
                  <p className="text-muted-foreground">{t('selectReferencePrompt')}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </main>
        </div>
      );
    };

    export default StudyReference;