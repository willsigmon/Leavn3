import { supabase } from '@/lib/supabaseClient';

    export const initialBooksToChunkLoad = ["Genesis", "Exodus", "Leviticus"]; 
    
    let allBibleBooksCache = null;
    let bookChaptersCache = {}; 

    export const getAllBibleBooks = async () => {
      if (allBibleBooksCache) {
        return allBibleBooksCache;
      }
      try {
        const { data, error } = await supabase
          .from('bible_books')
          .select('id, name, testament, book_order')
          .order('book_order', { ascending: true });
        if (error) {
          console.error("Error fetching Bible books list:", error);
          return []; 
        }
        allBibleBooksCache = data;
        return data;
      } catch (error) {
        console.error("Error fetching Bible books list (catch):", error);
        return []; 
      }
    };
    
    export const getChaptersForBook = async (bookName) => {
      if (bookChaptersCache[bookName]) {
        return bookChaptersCache[bookName];
      }
      try {
        const { data: bookData, error: bookError } = await supabase
          .from('bible_books')
          .select('id')
          .eq('name', bookName)
          .maybeSingle(); 

        if (bookError && bookError.code !== 'PGRST116') { 
            console.error(`Error fetching book ID for ${bookName}:`, bookError);
            throw bookError;
        }
        if (!bookData) {
            console.warn(`Book not found: ${bookName}`);
            return ['1']; // Fallback to chapter 1 if book not found
        }


        const { data: chapterData, error: chapterError } = await supabase
          .from('bible_chapters')
          .select('chapter_number')
          .eq('book_id', bookData.id)
          .order('chapter_number', { ascending: true });

        if (chapterError) {
            console.error(`Error fetching chapters for ${bookName}:`, chapterError);
            return ['1']; // Fallback
        }
        
        if (!chapterData || chapterData.length === 0) {
            console.warn(`No chapters found for ${bookName} (ID: ${bookData.id}), defaulting to ['1']`);
            bookChaptersCache[bookName] = ['1'];
            return ['1'];
        }
        
        const chapterNumbers = chapterData.map(c => c.chapter_number.toString());
        bookChaptersCache[bookName] = chapterNumbers;
        return chapterNumbers;

      } catch (error) {
        console.error(`Error in getChaptersForBook for ${bookName} (catch):`, error);
        return ['1']; // Fallback
      }
    };


    export const fetchBookData = async (bookName, translationAbbr, chapterNumber) => {
      try {
        const { data: versionData, error: versionError } = await supabase
          .from('bible_versions')
          .select('id')
          .eq('abbreviation', translationAbbr)
          .maybeSingle(); 
        if (versionError && versionError.code !== 'PGRST116') throw versionError;
        if (!versionData) {
            const errorMessage = `Version ${translationAbbr} not found`;
            console.error(errorMessage);
            return { [chapterNumber]: [{ text: errorMessage, id: 'error', number: 1, tags: [], location: null }] };
        }

        const { data: bookData, error: bookError } = await supabase
          .from('bible_books')
          .select('id')
          .eq('name', bookName)
          .maybeSingle();
        if (bookError && bookError.code !== 'PGRST116') throw bookError;
        if (!bookData) {
            const errorMessage = `Book ${bookName} not found`;
            console.error(errorMessage);
            return { [chapterNumber]: [{ text: errorMessage, id: 'error', number: 1, tags: [], location: null }] };
        }

        const { data: chapterEntry, error: chapterEntryError } = await supabase
          .from('bible_chapters')
          .select('id')
          .eq('book_id', bookData.id)
          .eq('chapter_number', parseInt(chapterNumber))
          .maybeSingle();
        if (chapterEntryError && chapterEntryError.code !== 'PGRST116') throw chapterEntryError;
        if (!chapterEntry) {
            const errorMessage = `Chapter ${chapterNumber} for book ${bookName} (ID: ${bookData.id}) not found`;
            console.error(errorMessage);
            return { [chapterNumber]: [{ text: errorMessage, id: 'error', number: 1, tags: [], location: null }] };
        }
        
        const { data: versesData, error: versesError } = await supabase
          .from('bible_verses')
          .select('verse_number, text')
          .eq('version_id', versionData.id)
          .eq('chapter_id', chapterEntry.id)
          .order('verse_number', { ascending: true });

        if (versesError) throw versesError;

        if (!versesData || versesData.length === 0) {
             console.warn(`No verses found for ${bookName} ${translationAbbr} Ch. ${chapterNumber}`);
             return { [chapterNumber]: [{ text: `No verses found for this chapter.`, number: 1, id: 'not_found', tags: [], location: null }] };
        }

        const chapterVerses = versesData.map(v => ({
          text: v.text,
          number: v.verse_number,
        }));
        
        const bookChapterData = {
          [chapterNumber]: chapterVerses.map(v => ({ text: v.text, number: v.number, tags: [], location: null })) 
        };

        return bookChapterData;

      } catch (error) {
        console.error(`Error fetching data for ${bookName} ${translationAbbr} Ch. ${chapterNumber}:`, error);
        return { [chapterNumber]: [{ text: `Error loading chapter ${chapterNumber}: ${error.message}`, id: 'error', number: 1, tags: [], location: null }] };
      }
    };
    
    export const getVerseLocation = async (verseIdComponents) => {
      const { versionAbbr, bookName, chapterNum, verseNum } = verseIdComponents;
      try {
        const { data: versionData, error: versionError } = await supabase
          .from('bible_versions')
          .select('id')
          .eq('abbreviation', versionAbbr)
          .maybeSingle();
        if (versionError && versionError.code !== 'PGRST116') throw versionError;
        if (!versionData) return null; // Version not found, so no location

        const { data: bookData, error: bookError } = await supabase
          .from('bible_books')
          .select('id')
          .eq('name', bookName)
          .maybeSingle();
        if (bookError && bookError.code !== 'PGRST116') throw bookError;
        if (!bookData) return null; // Book not found
        
        const { data: chapterData, error: chapterError } = await supabase
          .from('bible_chapters')
          .select('id')
          .eq('book_id', bookData.id)
          .eq('chapter_number', parseInt(chapterNum))
          .maybeSingle();
        if (chapterError && chapterError.code !== 'PGRST116') throw chapterError;
        if (!chapterData) return null; // Chapter not found

        const { data: verseData, error: verseError } = await supabase
          .from('bible_verses')
          .select('id')
          .eq('version_id', versionData.id)
          .eq('chapter_id', chapterData.id)
          .eq('verse_number', parseInt(verseNum))
          .maybeSingle();
        if (verseError && verseError.code !== 'PGRST116') throw verseError;
        if (!verseData) return null; // Verse not found

        const { data: locationData, error: locationError } = await supabase
          .from('verse_locations')
          .select('location_name, latitude, longitude, zoom_level')
          .eq('verse_id', verseData.id)
          .maybeSingle(); // Changed from single()
        
        if (locationError && locationError.code !== 'PGRST116') { // Not found is ok (PGRST116)
          console.error(`Error fetching location data for verse ID ${verseData.id}:`, locationError);
          throw locationError;
        }

        if (locationData) {
          return { 
            name: locationData.location_name, 
            lat: parseFloat(locationData.latitude), 
            lon: parseFloat(locationData.longitude), 
            zoom: locationData.zoom_level 
          };
        }
        return null;

      } catch (error) {
        console.error(`Error in getVerseLocation for ${bookName} ${chapterNum}:${verseNum} (${versionAbbr}):`, error);
        return null;
      }
    };


    export const bibleBookNames = async () => {
        const books = await getAllBibleBooks();
        return books.map(b => b.name);
    }

