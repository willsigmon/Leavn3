import React, { useState, useEffect, useCallback } from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import ReaderPage from '@/pages/ReaderPage';
    import BibleSearch from '@/components/BibleSearch';
    import TopicalStudy from '@/components/TopicalStudy';
    import HarmonyOfGospels from '@/components/HarmonyOfGospels';
    import StudyReference from '@/components/StudyReference';
    import TheologicalResources from '@/components/TheologicalResources';
    import GlobalSearch from '@/components/custom/GlobalSearch';
    import Footer from '@/components/custom/Footer';
    import { Toaster } from '@/components/ui/toaster';
    import { Button } from '@/components/ui/button';
    import { Moon, Sun, Globe } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useLocalization } from '@/hooks/useLocalization.jsx';
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";
    import { translations } from '@/lib/translations';
    import { useToast } from '@/components/ui/use-toast';
    import { bibleBookNames } from '@/lib/bibleData';


    const AppContent = () => {
      const { t, language, setLanguage } = useLocalization();
      const { toast } = useToast();
      const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
          return JSON.parse(savedMode);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      });

      const [searchTarget, setSearchTarget] = useState(null);
      const [currentBibleBooksList, setCurrentBibleBooksList] = useState([]);

      useEffect(() => {
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      }, [darkMode]);

      useEffect(() => {
        const fetchBooks = async () => {
          const bookList = await bibleBookNames();
          setCurrentBibleBooksList(bookList);
        };
        fetchBooks();
      }, []);

      const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
      };

      const handleGlobalSearchSubmit = (query) => {
        const parts = query.match(/^(\d?\s?[a-zA-Z]+)\s*(\d+)(?:\s*[:\-\.]\s*(\d+))?$/);
        if (parts) {
          const bookNameInput = parts[1].trim();
          const chapterNum = parts[2];
          const verseNum = parts[3] ? parseInt(parts[3]) : null;

          const foundBook = currentBibleBooksList.find(b => b.toLowerCase().replace(/\s/g, '') === bookNameInput.toLowerCase().replace(/\s/g, ''));
          
          if (foundBook) {
            setSearchTarget({ book: foundBook, chapter: chapterNum, verse: verseNum, query });
          } else {
            toast({ title: t('searchError'), description: t('bookNotFound', { book: bookNameInput }), variant: "destructive" });
          }
        } else {
          toast({ title: t('searchError'), description: t('invalidFormat'), variant: "destructive" });
        }
      };
      
      const clearSearchTarget = useCallback(() => {
        setSearchTarget(null);
      }, []);


      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-950 dark:to-sky-950 text-foreground transition-colors duration-300">
          <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 flex justify-between items-center glass-card mx-2 sm:mx-4 mt-2 sm:mt-4">
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500 dark:from-sky-400 dark:via-emerald-400 dark:to-teal-400 shrink-0">
              {t('appName')}
            </h1>
            <GlobalSearch onSearchSubmit={handleGlobalSearchSubmit} />
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-auto sm:w-[80px] rounded-xl sm:rounded-2xl h-8 sm:h-9 px-2 text-xs" aria-label={t('selectLanguage')}>
                   <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1 opacity-70" /> <SelectValue placeholder={t('languagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(translations).map((langCode) => (
                    <SelectItem key={langCode} value={langCode} className="text-xs">
                      {langCode.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                aria-label={darkMode ? t('lightMode') : t('darkMode')}
                className="rounded-xl sm:rounded-2xl h-8 w-8 sm:h-9 sm:w-9"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? "moon" : "sun"}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {darkMode ? <Sun className="h-5 w-5 sm:h-6 sm:w-6" /> : <Moon className="h-5 w-5 sm:h-6 sm:w-6" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>
          </header>
          <main className="flex-grow flex flex-col pt-20 sm:pt-24 pb-8 px-2 sm:px-4">
            <Routes>
              <Route path="/" element={<ReaderPage searchTarget={searchTarget} clearSearchTarget={clearSearchTarget} />} />
              <Route path="/search" element={<BibleSearch />} />
              <Route path="/study/topics/:type/:topic?" element={<TopicalStudy />} />
              <Route path="/study/topics/:type" element={<TopicalStudy />} /> {/* For type without topic */}
              <Route path="/study/harmony" element={<HarmonyOfGospels />} />
              <Route path="/study/harmony/event/:eventId" element={<HarmonyOfGospels />} />
              <Route path="/study/reference/:type/:book?" element={<StudyReference />} />
              <Route path="/study/reference/:type" element={<StudyReference />} /> {/* For type without book */}
              <Route path="/study/theological/:type/:id?" element={<TheologicalResources />} />
              <Route path="/study/theological/:type" element={<TheologicalResources />} /> {/* For type without id */}
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      );
    }

    function App() {
      return (
        <Router>
          <AppContent />
        </Router>
      )
    }

    export default App;

