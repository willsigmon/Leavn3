import { supabase } from '@/lib/supabaseClient';
    import { translations } from '@/lib/translations';

    const isValidVerseIdString = (verseIdString) => {
        if (!verseIdString || typeof verseIdString !== 'string') return false;
        const parts = verseIdString.split('_');
        // Check for 4 parts, and that chapter (parts[2]) and verse (parts[3]) are numbers
        return parts.length === 4 && /^\d+$/.test(parts[2]) && /^\d+$/.test(parts[3]);
    };

    export const parseVerseIdForSupabase = async (verseIdString) => {
        if (!isValidVerseIdString(verseIdString)) {
            throw new Error(`Invalid verse ID format: '${verseIdString}'. Expected format 'VERSION_BOOK_CHAPTER_VERSE'.`);
        }
        const [versionAbbr, bookName, chapterNum, verseNum] = verseIdString.split('_');
        
        const { data: versionData, error: versionError } = await supabase
            .from('bible_versions')
            .select('id')
            .eq('abbreviation', versionAbbr)
            .maybeSingle();
        if (versionError && versionError.code !== 'PGRST116') throw versionError;
        if (!versionData) throw new Error(`Version '${versionAbbr}' not found.`);

        const { data: bookData, error: bookError } = await supabase
            .from('bible_books')
            .select('id')
            .eq('name', bookName)
            .maybeSingle();
        if (bookError && bookError.code !== 'PGRST116') throw bookError;
        if (!bookData) throw new Error(`Book '${bookName}' not found.`);

        const { data: chapterData, error: chapterError } = await supabase
            .from('bible_chapters')
            .select('id')
            .eq('book_id', bookData.id)
            .eq('chapter_number', parseInt(chapterNum))
            .maybeSingle();
        if (chapterError && chapterError.code !== 'PGRST116') throw chapterError;
        if (!chapterData) throw new Error(`Chapter ${chapterNum} for book '${bookName}' not found.`);
        
        const { data: verseSupabaseData, error: verseError } = await supabase
            .from('bible_verses')
            .select('id')
            .eq('version_id', versionData.id)
            .eq('chapter_id', chapterData.id)
            .eq('verse_number', parseInt(verseNum))
            .maybeSingle();
        if (verseError && verseError.code !== 'PGRST116') throw verseError;
        if (!verseSupabaseData) throw new Error(`Verse ${verseNum} not found in ${bookName} ch ${chapterNum} (${versionAbbr}).`);
        
        return verseSupabaseData.id; 
    };

    export const getSupabaseData = async (tableName, selectQuery, eqColumn, eqValue, isSingle = false, verseIdString) => {
      const lang = localStorage.getItem('appLanguage') || 'en';
      let supabaseVerseId = eqValue;

      if (eqColumn === 'verse_id' && verseIdString) {
         if (!isValidVerseIdString(verseIdString)) {
            console.error(`Invalid verseId ${verseIdString} passed to getSupabaseData.`);
            const errorMsg = `${translations[lang]?.error || "Error"}: ${translations[lang]?.invalidVerseIdFormat || "Invalid verse ID format." }`;
            if (isSingle) return { error: errorMsg, data: null };
            return [{ error: errorMsg, data: null }];
         }
         try {
            supabaseVerseId = await parseVerseIdForSupabase(verseIdString);
         } catch(e) {
             console.error(`Error parsing verseId ${verseIdString} for Supabase in getSupabaseData:`, e.message);
             const errorMsg = `${translations[lang]?.error || "Error"}: ${e.message || translations[lang]?.couldNotParseVerseId || "Could not parse verse ID." }`;
             if (isSingle) return { error: errorMsg, data: null }; 
             return [{ error: errorMsg, data: null }]; 
         }
      }

      try {
        let query = supabase.from(tableName).select(selectQuery);
        if (eqColumn && supabaseVerseId !== null && supabaseVerseId !== undefined) {
          query = query.eq(eqColumn, supabaseVerseId);
        }
        
        if (isSingle) {
          query = query.maybeSingle();
        }
        const { data, error } = await query;

        if (error) {
            if (error.code !== 'PGRST116' || !isSingle) { 
                throw error;
            }
        }
        
        return data; 
      } catch (error) {
        console.error(`Error fetching ${tableName}:`, error.message);
        const defaultErrorMessage = translations[lang]?.error || "Error";
        const specificErrorMessage = translations[lang]?.[`couldNotFetch${tableName.charAt(0).toUpperCase() + tableName.slice(1)}`] || `Could not fetch ${tableName}.`;
        
        const finalErrorMessage = `${defaultErrorMessage}: ${error.message || specificErrorMessage}`;

        if (isSingle) return { error: finalErrorMessage, data: null };
        return [{ error: finalErrorMessage, data: null }]; 
      }
    };