import { supabase } from '@/lib/supabaseClient';
    import { translations } from '@/lib/translations';
    import md5 from '@/lib/md5';
    import { getVerseLocation } from '@/lib/bibleData';
    import { getFromLocalStorage, setToLocalStorage, CACHE_EXPIRY_MS } from '@/lib/cacheUtils';
    import { parseVerseIdForSupabase, getSupabaseData } from '@/lib/supabaseDataUtils';

    const isValidVerseIdStringFormat = (verseIdString) => {
        if (!verseIdString || typeof verseIdString !== 'string') return false;
        const parts = verseIdString.split('_');
        return parts.length === 4 && /^\d+$/.test(parts[2]) && /^\d+$/.test(parts[3]);
    };
    
    export const verseDataManager = {
      getAiInsights: async (verseIdString, verseText, translation, preferences = {}) => {
        const lang = preferences.language || localStorage.getItem('appLanguage') || 'en';
        if (!isValidVerseIdStringFormat(verseIdString)) {
            return `${translations[lang]?.error || "Error"}: ${translations[lang]?.invalidVerseIdFormat || "Invalid verse ID format for AI Insights."}`;
        }
        const verseTextHash = md5(verseText || '');
        const preferencesHash = md5(JSON.stringify({ 
          tone: preferences.tone, 
          viewpoint: preferences.theologicalViewpoint, 
          denomination: preferences.denomination 
        }));
        const cacheKey = `aiInsights_${verseIdString}_${verseTextHash}_${preferencesHash}`;
        
        let cachedData = getFromLocalStorage(cacheKey);
        if (cachedData) return cachedData;

        try {
          const supabaseVerseId = await parseVerseIdForSupabase(verseIdString);
          const { data: supabaseCache, error: dbError } = await supabase
            .from('ai_insights_cache')
            .select('insight_text, generated_at')
            .eq('verse_id', supabaseVerseId) 
            .eq('verse_text_hash', verseTextHash)
            .eq('preferences_hash', preferencesHash)
            .maybeSingle();

          if (dbError && dbError.code !== 'PGRST116') console.warn('Supabase AI cache check error:', dbError.message);

          if (supabaseCache) {
            const generatedDate = new Date(supabaseCache.generated_at);
            if ((new Date().getTime() - generatedDate.getTime()) < CACHE_EXPIRY_MS) {
              setToLocalStorage(cacheKey, supabaseCache.insight_text);
              return supabaseCache.insight_text;
            }
          }
        } catch(e) {
          console.warn(`Error checking Supabase AI cache for ${verseIdString}:`, e.message);
        }

        try {
          const { data, error } = await supabase.functions.invoke('get-ai-insights', {
            body: { verseId: verseIdString, verseText, translation, preferences }, 
          });

          if (error) throw error;
          
          if (data && data.insight) {
            setToLocalStorage(cacheKey, data.insight);
            try {
                const supabaseVerseIdForUpsert = await parseVerseIdForSupabase(verseIdString);
                supabase
                  .from('ai_insights_cache')
                  .upsert({ 
                    verse_id: supabaseVerseIdForUpsert, 
                    verse_text_hash: verseTextHash,
                    preferences_hash: preferencesHash,
                    insight_text: data.insight,
                    ai_model_version: data.model || 'unknown',
                    generated_at: new Date().toISOString()
                  }, { onConflict: 'verse_id,verse_text_hash,preferences_hash' })
                  .then(({ error: upsertError }) => {
                    if (upsertError) console.warn('Error saving AI insight to Supabase cache:', upsertError.message);
                  });
            } catch (e) {
                console.warn('Error parsing verseId for AI insight upsert:', e.message);
            }
            return data.insight;
          }
          return translations[lang]?.noDataAvailableForAiInsights || "No AI insights available.";
        } catch (error) {
          console.error('Error fetching AI insights from Edge Function:', error);
          const defaultErrorMessage = translations[lang]?.error || "Error";
          const specificErrorMessage = translations[lang]?.noDataAvailableForAiInsights || "Could not fetch AI insights.";
          return `${defaultErrorMessage}: ${error.message || specificErrorMessage}`;
        }
      },

      getMapData: async (verseIdString) => {
        const lang = localStorage.getItem('appLanguage') || 'en';
        if (!isValidVerseIdStringFormat(verseIdString)) {
            return { error: `${translations[lang]?.error || "Error"}: ${translations[lang]?.invalidVerseIdFormat || "Invalid verse ID format for Map Data."}`};
        }
        const cacheKey = `mapData_${verseIdString}`;
        const cachedData = getFromLocalStorage(cacheKey);
        if (cachedData) return cachedData;

        try {
          const verseIdComponents = {
            versionAbbr: verseIdString.split('_')[0],
            bookName: verseIdString.split('_')[1],
            chapterNum: verseIdString.split('_')[2],
            verseNum: verseIdString.split('_')[3],
          };
          const location = await getVerseLocation(verseIdComponents);
          if (location && !location.error) {
            const mapInfo = {
              lat: location.lat,
              lon: location.lon,
              popupText: `${location.name} (${verseIdString.split('_').slice(1,4).join(' ')})`,
              zoom: location.zoom || 8
            };
            setToLocalStorage(cacheKey, mapInfo);
            return mapInfo;
          }
          if (location && location.error) return { error: location.error };
          return null;
        } catch (error) {
          console.warn('Error fetching map data:', error);
          return { error: error.message || "Failed to fetch map data" };
        }
      },

      getCommentaries: async (verseIdString) => {
        const lang = localStorage.getItem('appLanguage') || 'en';
        if (!isValidVerseIdStringFormat(verseIdString)) {
            return [{ error: `${translations[lang]?.error || "Error"}: ${translations[lang]?.invalidVerseIdFormat || "Invalid verse ID format for Commentaries."}`}];
        }
        const cacheKey = `commentaries_${verseIdString}`;
        const cachedData = getFromLocalStorage(cacheKey);
        if (cachedData) return cachedData;
        
        const data = await getSupabaseData('commentaries', 'source_name, commentary_text, author, publication_year', 'verse_id', null, false, verseIdString);
        if (data && (!Array.isArray(data) || data.length === 0 || !data[0]?.error)) {
            setToLocalStorage(cacheKey, data);
            return data;
        }
        return Array.isArray(data) ? data : [{ error: "Could not load commentaries." }];
      },

      getCrossReferences: async (verseIdString) => {
        const lang = localStorage.getItem('appLanguage') || 'en';
         if (!isValidVerseIdStringFormat(verseIdString)) {
            return [{ error: `${translations[lang]?.error || "Error"}: ${translations[lang]?.invalidVerseIdFormat || "Invalid verse ID format for Cross References."}`}];
        }
        const cacheKey = `crossReferences_${verseIdString}`;
        const cachedData = getFromLocalStorage(cacheKey);
        if (cachedData) return cachedData;

        const data = await getSupabaseData('cross_references', 'target_verse_id, description', 'source_verse_id', null, false, verseIdString);
         if (data && (!Array.isArray(data) || data.length === 0 || !data[0]?.error)) {
            setToLocalStorage(cacheKey, data);
            return data;
        }
        return Array.isArray(data) ? data : [{ error: "Could not load cross-references." }];
      },

      getHistoricalContext: async (verseIdString) => {
        const lang = localStorage.getItem('appLanguage') || 'en';
        if (!isValidVerseIdStringFormat(verseIdString)) {
            return { error: `${translations[lang]?.error || "Error"}: ${translations[lang]?.invalidVerseIdFormat || "Invalid verse ID format for Historical Context."}`};
        }
        const cacheKey = `historicalContext_${verseIdString}`;
        const cachedData = getFromLocalStorage(cacheKey);
        if (cachedData) return cachedData;
        
        const data = await getSupabaseData('historical_contexts', 'context_text, tags', 'verse_id', null, true, verseIdString);
        if (data && !data.error) {
             setToLocalStorage(cacheKey, data);
        }
        return data;
      },

      getKeyFigures: async (verseIdString) => {
        const lang = localStorage.getItem('appLanguage') || 'en';
        if (!isValidVerseIdStringFormat(verseIdString)) {
             return [{ figure_name: "Error", description: `${translations[lang]?.error || "Error"}: ${translations[lang]?.invalidVerseIdFormat || "Invalid verse ID format for Key Figures."}`}];
        }
        const cacheKey = `keyFigures_${verseIdString}`;
        let cachedData = getFromLocalStorage(cacheKey);
        if (cachedData) return cachedData;

        let supabaseVerseId;
        try {
            supabaseVerseId = await parseVerseIdForSupabase(verseIdString);
        } catch (e) {
            console.error(`Error parsing verseId ${verseIdString} for Key Figures:`, e);
            const defaultErrorMessage = translations[lang]?.error || "Error";
            const specificErrorMessage = translations[lang]?.couldNotFetchKeyFigures || "Could not fetch key figures.";
            return [{ figure_name: "Error", description: `${defaultErrorMessage}: ${e.message || specificErrorMessage}` }];
        }

        try {
          const { data: verseFiguresLinks, error: linksError } = await supabase
            .from('verse_key_figures')
            .select('key_figure_id, mention_type')
            .eq('verse_id', supabaseVerseId);

          if (linksError && linksError.code !== 'PGRST116') throw linksError;

          if (!verseFiguresLinks || verseFiguresLinks.length === 0) {
            setToLocalStorage(cacheKey, []);
            return [];
          }

          const figureIds = verseFiguresLinks.map(link => link.key_figure_id);

          const { data: figuresData, error: figuresError } = await supabase
            .from('key_figures')
            .select('id, figure_name, description, related_verses')
            .in('id', figureIds);
          
          if (figuresError) throw figuresError;

          if (!figuresData || figuresData.length === 0) {
            setToLocalStorage(cacheKey, []);
            return [];
          }
          
          const result = figuresData.map(fig => {
            const link = verseFiguresLinks.find(l => l.key_figure_id === fig.id);
            return {
              ...fig,
              mention_type: link ? link.mention_type : 'related'
            };
          });

          setToLocalStorage(cacheKey, result);
          return result;

        } catch (error) {
          console.error('Error fetching key figures:', error);
          const defaultErrorMessage = translations[lang]?.error || "Error";
          const specificErrorMessage = translations[lang]?.couldNotFetchKeyFigures || "Could not fetch key figures.";
          return [{ figure_name: "Error", description: `${defaultErrorMessage}: ${error.message || specificErrorMessage}` }];
        }
      },
    };