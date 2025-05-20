import React, { useState, useEffect, useMemo } from 'react';
    import { useParams, Link, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useLocalization } from '@/hooks/useLocalization';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Skeleton } from '@/components/ui/skeleton';
    import { ChevronLeft, ChevronRight, Search, Layers } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const TheologicalResources = () => {
      const { type, id: resourceId } = useParams();
      const navigate = useNavigate();
      const { t } = useLocalization();

      const [resourcesList, setResourcesList] = useState([]);
      const [selectedResource, setSelectedResource] = useState(null);
      const [isLoadingList, setIsLoadingList] = useState(true);
      const [isLoadingContent, setIsLoadingContent] = useState(false);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        const fetchResourcesList = async () => {
          setIsLoadingList(true);
          setError(null);
          try {
            const { data, error: fetchError } = await supabase.functions.invoke('theological-type-list-handler', {
              body: JSON.stringify({ type }),
              method: 'POST',
            });
            if (fetchError) throw fetchError;
            if (data && data.error) throw new Error(data.error);
            setResourcesList(data.resources || []);
          } catch (err) {
            console.error(`Error fetching theological resources list for type ${type}:`, err);
            setError(t('errorFetchingResourcesList') + (err.message ? `: ${err.message}` : ''));
            setResourcesList([]);
          } finally {
            setIsLoadingList(false);
          }
        };
        fetchResourcesList();
      }, [type, t]);

      useEffect(() => {
        if (resourceId) {
          fetchResourceContent(resourceId);
        } else {
          setSelectedResource(null);
        }
      }, [resourceId, type, t]);

      const fetchResourceContent = async (id) => {
        setIsLoadingContent(true);
        setError(null);
        setSelectedResource(null);
        try {
          const { data, error: fetchError } = await supabase.functions.invoke('theological-type-id-handler', {
            body: JSON.stringify({ type, id }),
            method: 'POST',
          });
          if (fetchError) throw fetchError;
          if (data && data.error) throw new Error(data.error);
          setSelectedResource(data);
        } catch (err) {
          console.error(`Error fetching content for theological resource ${id}:`, err);
          setError(t('errorFetchingResourceContent') + (err.message ? `: ${err.message}` : ''));
          setSelectedResource(null);
        } finally {
          setIsLoadingContent(false);
        }
      };

      const filteredResources = useMemo(() => {
        if (!searchTerm) return resourcesList;
        return resourcesList.filter(resource =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.summary && resource.summary.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }, [resourcesList, searchTerm]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      if (error && !isLoadingList && !isLoadingContent) {
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
                <CardTitle className="text-xl">{t('theologicalResources')}: {type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    placeholder={t('searchResources')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {isLoadingList ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <motion.ul 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-1 max-h-[60vh] overflow-y-auto pretty-scrollbar pr-1"
                  >
                    {filteredResources.length > 0 ? filteredResources.map(resource => (
                      <motion.li key={resource.id} variants={itemVariants}>
                        <Button
                          asChild
                          variant={resourceId === resource.id.toString() ? 'default' : 'ghost'}
                          className="w-full justify-start"
                        >
                          <Link to={`/study/theological/${type}/${resource.id}`}>{resource.title}</Link>
                        </Button>
                      </motion.li>
                    )) : <p className="text-sm text-muted-foreground">{t('noResourcesFound')}</p>}
                  </motion.ul>
                )}
              </CardContent>
            </Card>
          </motion.aside>

          <main className="w-full md:w-2/3 lg:w-3/4">
            <AnimatePresence mode="wait">
              {isLoadingContent ? (
                <motion.div
                  key="loading-theo"
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
                    </CardContent>
                  </Card>
                </motion.div>
              ) : selectedResource ? (
                <motion.div
                  key={selectedResource.id || 'theo-content'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl md:text-3xl font-bold">{selectedResource.title}</CardTitle>
                      {selectedResource.meta?.author && <CardDescription>{t('author')}: {selectedResource.meta.author}</CardDescription>}
                      {selectedResource.meta?.category && <CardDescription>{t('category')}: {selectedResource.meta.category}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      {selectedResource.meta?.summary && <p className="italic text-muted-foreground mb-4">{selectedResource.meta.summary}</p>}
                      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedResource.content || t('noContentAvailable') }} />
                      {selectedResource.meta?.source_publication && (
                        <p className="text-xs text-muted-foreground mt-6">{t('publication')}: {selectedResource.meta.source_publication}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : !resourceId && !isLoadingList ? (
                <motion.div
                  key="placeholder-theo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center"
                >
                  <Layers className="w-24 h-24 text-muted-foreground/30 mb-6" />
                  <h2 className="text-2xl font-semibold text-muted-foreground mb-2">{t('selectTheologicalResource')}</h2>
                  <p className="text-muted-foreground">{t('selectResourcePrompt')}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </main>
        </div>
      );
    };

    export default TheologicalResources;

