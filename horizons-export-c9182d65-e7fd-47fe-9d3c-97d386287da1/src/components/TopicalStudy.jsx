import React, { useState, useEffect, useMemo } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useLocalization } from '@/hooks/useLocalization';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Skeleton } from '@/components/ui/skeleton';
    import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const TopicalStudy = () => {
      const { type, topic: topicSlug } = useParams();
      const { t } = useLocalization();
      const [topics, setTopics] = useState([]);
      const [selectedTopic, setSelectedTopic] = useState(null);
      const [isLoadingTopics, setIsLoadingTopics] = useState(true);
      const [isLoadingTopicContent, setIsLoadingTopicContent] = useState(false);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        const fetchTopics = async () => {
          setIsLoadingTopics(true);
          setError(null);
          try {
            const { data, error: fetchError } = await supabase.functions.invoke('topics-type-list-handler', {
              body: JSON.stringify({ type }),
              method: 'POST', 
            });
            if (fetchError) throw fetchError;
            if (data && data.error) throw new Error(data.error);
            setTopics(data.topics || []);
          } catch (err) {
            console.error(`Error fetching topics for type ${type}:`, err);
            setError(t('errorFetchingTopics') + (err.message ? `: ${err.message}` : ''));
            setTopics([]);
          } finally {
            setIsLoadingTopics(false);
          }
        };
        fetchTopics();
      }, [type, t]);

      useEffect(() => {
        if (topicSlug && topics.length > 0) {
          const currentTopic = topics.find(tItem => tItem.slug === topicSlug);
          if (currentTopic) {
            fetchTopicContent(currentTopic.slug);
          }
        } else if (!topicSlug) {
          setSelectedTopic(null); // Clear content if no topic slug
        }
      }, [topicSlug, topics, type, t]);
      
      const fetchTopicContent = async (slug) => {
        setIsLoadingTopicContent(true);
        setError(null);
        setSelectedTopic(null); 
        try {
          const { data, error: fetchError } = await supabase.functions.invoke('topics-type-topic-handler', {
            body: JSON.stringify({ type, topic: slug }),
            method: 'POST',
          });
          if (fetchError) throw fetchError;
          if (data && data.error) throw new Error(data.error);
          setSelectedTopic(data);
        } catch (err) {
          console.error(`Error fetching content for topic ${slug}:`, err);
          setError(t('errorFetchingTopicContent') + (err.message ? `: ${err.message}` : ''));
          setSelectedTopic(null);
        } finally {
          setIsLoadingTopicContent(false);
        }
      };
      

      const filteredTopics = useMemo(() => {
        if (!searchTerm) return topics;
        return topics.filter(topic =>
          topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }, [topics, searchTerm]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      if (error) {
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
                <CardTitle className="text-xl">{t('topics')}: {type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    placeholder={t('searchTopics')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {isLoadingTopics ? (
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
                    {filteredTopics.length > 0 ? filteredTopics.map(topic => (
                      <motion.li key={topic.slug} variants={itemVariants}>
                        <Button
                          asChild
                          variant={topicSlug === topic.slug ? 'default' : 'ghost'}
                          className="w-full justify-start"
                        >
                          <Link to={`/study/topics/${type}/${topic.slug}`}>{topic.title}</Link>
                        </Button>
                      </motion.li>
                    )) : <p className="text-sm text-muted-foreground">{t('noTopicsFound')}</p>}
                  </motion.ul>
                )}
              </CardContent>
            </Card>
          </motion.aside>

          <main className="w-full md:w-2/3 lg:w-3/4">
            <AnimatePresence mode="wait">
              {isLoadingTopicContent ? (
                <motion.div
                  key="loading"
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
              ) : selectedTopic ? (
                <motion.div
                  key={selectedTopic.slug || 'topic-content'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl md:text-3xl font-bold">{selectedTopic.title || t('topicContent')}</CardTitle>
                      {selectedTopic.description && <CardDescription>{selectedTopic.description}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      {selectedTopic.relatedVerses && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2">{t('relatedVerses')}</h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {selectedTopic.relatedVerses.map((verse, index) => (
                              <li key={index}>
                                <Link to={`/?book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verse}`} className="text-primary hover:underline">
                                  {verse.reference}
                                </Link>: "{verse.text}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedTopic.content || t('noContentAvailable') }} />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : !topicSlug && !isLoadingTopics ? (
                 <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center"
                  >
                    <Search className="w-24 h-24 text-muted-foreground/30 mb-6" />
                    <h2 className="text-2xl font-semibold text-muted-foreground mb-2">{t('selectATopic')}</h2>
                    <p className="text-muted-foreground">{t('selectTopicPrompt')}</p>
                  </motion.div>
              ) : null}
            </AnimatePresence>
          </main>
        </div>
      );
    };

    export default TopicalStudy;

