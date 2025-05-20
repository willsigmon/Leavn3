import React, { useState, useEffect, useMemo } from 'react';
    import { Link, useParams, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useLocalization } from '@/hooks/useLocalization';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Skeleton } from '@/components/ui/skeleton';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { ChevronLeft, ChevronRight, Search, BookOpen } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const HarmonyOfGospels = () => {
      const { eventId } = useParams();
      const navigate = useNavigate();
      const { t } = useLocalization();

      const [events, setEvents] = useState([]);
      const [selectedEvent, setSelectedEvent] = useState(null);
      const [isLoadingEvents, setIsLoadingEvents] = useState(true);
      const [isLoadingEventContent, setIsLoadingEventContent] = useState(false);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        const fetchEventsList = async () => {
          setIsLoadingEvents(true);
          setError(null);
          try {
            const { data, error: fetchError } = await supabase.functions.invoke('harmony-handler', {
              method: 'GET', // Assuming GET for list
            });
            if (fetchError) throw fetchError;
            if (data && data.error) throw new Error(data.error);
            setEvents(data.events || []);
          } catch (err) {
            console.error('Error fetching harmony events list:', err);
            setError(t('errorFetchingHarmonyEvents') + (err.message ? `: ${err.message}` : ''));
            setEvents([]);
          } finally {
            setIsLoadingEvents(false);
          }
        };
        fetchEventsList();
      }, [t]);

      useEffect(() => {
        if (eventId) {
          fetchEventDetails(eventId);
        } else {
          setSelectedEvent(null);
        }
      }, [eventId, t]);

      const fetchEventDetails = async (id) => {
        setIsLoadingEventContent(true);
        setError(null);
        setSelectedEvent(null);
        try {
          const { data, error: fetchError } = await supabase.functions.invoke('harmony-event-handler', {
            body: JSON.stringify({ id }), 
            method: 'POST', 
          });
          if (fetchError) throw fetchError;
          if (data && data.error) throw new Error(data.error);
          setSelectedEvent(data);
        } catch (err) {
          console.error(`Error fetching details for event ${id}:`, err);
          setError(t('errorFetchingEventDetails') + (err.message ? `: ${err.message}` : ''));
          setSelectedEvent(null);
        } finally {
          setIsLoadingEventContent(false);
        }
      };

      const filteredEvents = useMemo(() => {
        if (!searchTerm) return events;
        return events.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }, [events, searchTerm]);
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
      };

      const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 }
      };

      if (error && !isLoadingEvents && !isLoadingEventContent) {
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
                <CardTitle className="text-xl">{t('gospelEvents')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Input
                    type="text"
                    placeholder={t('searchEvents')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {isLoadingEvents ? (
                  <div className="space-y-2">
                    {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <motion.ul 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-1 max-h-[60vh] overflow-y-auto pretty-scrollbar pr-1"
                  >
                    {filteredEvents.length > 0 ? filteredEvents.map(event => (
                      <motion.li key={event.id} variants={itemVariants}>
                        <Button
                          asChild
                          variant={eventId === event.id ? 'default' : 'ghost'}
                          className="w-full justify-start text-left h-auto py-2"
                        >
                          <Link to={`/study/harmony/event/${event.id}`}>
                            <span className="font-medium">{event.title}</span>
                            {event.period && <span className="text-xs text-muted-foreground block">{event.period}</span>}
                          </Link>
                        </Button>
                      </motion.li>
                    )) : <p className="text-sm text-muted-foreground">{t('noEventsFound')}</p>}
                  </motion.ul>
                )}
              </CardContent>
            </Card>
          </motion.aside>

          <main className="w-full md:w-2/3 lg:w-3/4">
            <AnimatePresence mode="wait">
            {isLoadingEventContent ? (
              <motion.div
                key="loading-event"
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
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="grid grid-cols-4 gap-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ) : selectedEvent ? (
              <motion.div
                key={selectedEvent.id || 'event-content'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold">{selectedEvent.title}</CardTitle>
                    {selectedEvent.description && <CardDescription className="mt-1">{selectedEvent.description}</CardDescription>}
                    {selectedEvent.period && <p className="text-sm text-muted-foreground mt-1">{t('period')}: {selectedEvent.period}</p>}
                    {selectedEvent.location && <p className="text-sm text-muted-foreground">{t('location')}: {selectedEvent.location}</p>}
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-3">{t('references')}</h3>
                    {selectedEvent.references && selectedEvent.references.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    {selectedEvent.gospelsPresent.map(gospel => <TableHead key={gospel}>{gospel}</TableHead>)}
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                <TableRow>
                                    {selectedEvent.gospelsPresent.map(gospel => (
                                    <TableCell key={gospel}>
                                        {selectedEvent.references.filter(ref => ref.gospel.toLowerCase() === gospel.toLowerCase()).map((ref, idx) => (
                                        <Link
                                            key={idx}
                                            to={`/?book=${ref.book}&chapter=${ref.chapter}&verse=${ref.startVerse}`}
                                            className="block text-primary hover:underline text-sm mb-1"
                                        >
                                            {ref.reference_display || `${ref.book} ${ref.chapter}:${ref.startVerse}${ref.endVerse && ref.endVerse !== ref.startVerse ? `-${ref.endVerse}` : ''}`}
                                        </Link>
                                        ))}
                                    </TableCell>
                                    ))}
                                </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p>{t('noReferencesAvailable')}</p>
                    )}
                    {selectedEvent.commentary && (
                        <div className="mt-6 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: selectedEvent.commentary }} />
                    )}

                  </CardContent>
                </Card>
              </motion.div>
            ) : !eventId && !isLoadingEvents ? (
              <motion.div
                key="placeholder-event"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center"
              >
                <BookOpen className="w-24 h-24 text-muted-foreground/30 mb-6" />
                <h2 className="text-2xl font-semibold text-muted-foreground mb-2">{t('selectAnEvent')}</h2>
                <p className="text-muted-foreground">{t('selectEventPrompt')}</p>
              </motion.div>
            ) : null}
            </AnimatePresence>
          </main>
        </div>
      );
    };

    export default HarmonyOfGospels;

