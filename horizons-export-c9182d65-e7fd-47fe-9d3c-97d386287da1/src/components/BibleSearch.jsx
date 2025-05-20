import React, { useState, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom'; // Corrected: Removed underscore
    import { supabase } from '@/lib/supabaseClient';
    import { useLocalization } from '@/hooks/useLocalization';
    import { useToast } from "@/components/ui/use-toast";

    const BibleSearch = () => {
      const { t, language } = useLocalization();
      const { toast } = useToast();
      const navigate = useNavigate();

      const [query, setQuery] = useState('');
      const [version, setVersion] = useState('kjv');
      const [scope, setScope] = useState('all');
      const [searchType, setSearchType] = useState('text');
      const [caseSensitive, setCaseSensitive] = useState(false);
      const [displayFormat, setDisplayFormat] = useState('verse');
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(false);
      const [showAdvanced, setShowAdvanced] = useState(false);

      const highlight = useCallback((text, term) => {
        if (!term || !text) return text;
        try {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return text.replace(new RegExp(`(${escapedTerm})`, caseSensitive ? 'g' : 'gi'), '<mark>$1</mark>');
        } catch (e) {
          console.error("Highlighting error:", e);
          return text;
        }
      }, [caseSensitive]);

      const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) {
          toast({ title: t('validationError') || "Validation Error", description: t('searchTermRequired') || "Search term is required.", variant: "destructive" });
          return;
        }
        setLoading(true);
        setResults([]);

        try {
          const payload = {
            query: query,
            version: version,
            options: {
              scope: scope,
              searchType: searchType,
              caseSensitive: caseSensitive,
              displayFormat: displayFormat,
              language: language,
            }
          };
          
          const { data, error: functionError } = await supabase.functions.invoke('bible-search-handler', {
            body: JSON.stringify(payload),
            method: 'POST',
          });

          if (functionError) throw functionError;
          
          if (data && data.error) { 
             throw new Error(data.error);
          }
          
          setResults(data.results || []);
          if (!data.results || data.results.length === 0) {
             toast({ title: t('noResultsFound') || "No Results", description: t('tryDifferentKeywordsOrOptions') || "Try different keywords or options." });
          }

        } catch (err) {
          console.error('Search failed:', err);
          const errorMessage = err.message || (t('searchFailedError') || "Search failed. Please try again.");
          toast({ title: t('searchError') || "Search Error", description: errorMessage, variant: "destructive" });
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="bible-search p-4 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                className="flex-1 border p-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder={searchType === 'strongs' ? "Strong's # (e.g. H3068)" : (t('searchPlaceholder') || 'Search…')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select value={version} onChange={(e) => setVersion(e.target.value)} className="border p-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                {['kjv', 'nasb', 'esv', 'niv', 'nlt', 'web'].map((v) => (
                  <option key={v} value={v}>{v.toUpperCase()}</option>
                ))}
              </select>
              <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded shadow transition-colors">
                {loading ? (t('loadingEllipsis') || '…') : (t('goButton') || 'Go')}
              </button>
            </div>

            <button
              type="button"
              className="text-sm text-sky-600 dark:text-sky-400 hover:underline self-start"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (t('hideAdvancedOptionsPlain') || '− Hide') : (t('showAdvancedOptionsPlain') || '+ Show')} {t('advancedOptionsSuffix') || 'advanced options'}
            </button>

            {showAdvanced && (
              <div className="grid gap-4 sm:grid-cols-2 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700">
                <fieldset>
                  <legend className="font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('searchType') || 'Search type'}</legend>
                  {['text', 'phrase', 'strongs'].map((t_opt) => (
                    <label key={t_opt} className="block text-sm text-slate-600 dark:text-slate-400">
                      <input
                        type="radio"
                        name="stype"
                        value={t_opt}
                        checked={searchType === t_opt}
                        onChange={() => setSearchType(t_opt)}
                        className="mr-2 accent-sky-500"
                      />
                      {t(t_opt) || t_opt}
                    </label>
                  ))}
                </fieldset>

                <fieldset>
                  <legend className="font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('searchScope') || 'Scope'}</legend>
                  {['all', 'ot', 'nt'].map((s_opt) => (
                    <label key={s_opt} className="block text-sm text-slate-600 dark:text-slate-400">
                      <input
                        type="radio"
                        name="scope"
                        value={s_opt}
                        checked={scope === s_opt}
                        onChange={() => setScope(s_opt)}
                        className="mr-2 accent-sky-500"
                      />
                      {t(s_opt) || s_opt.toUpperCase()}
                    </label>
                  ))}
                </fieldset>

                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={() => setCaseSensitive(!caseSensitive)}
                    className="mr-1 accent-sky-500"
                  />
                  {t('caseSensitive') || 'Case sensitive'}
                </label>

                <fieldset>
                  <legend className="font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('displayFormat') || 'Display'}</legend>
                  {['verse', 'paragraph'].map((d_opt) => (
                    <label key={d_opt} className="mr-4 text-sm text-slate-600 dark:text-slate-400">
                      <input
                        type="radio"
                        name="disp"
                        value={d_opt}
                        checked={displayFormat === d_opt}
                        onChange={() => setDisplayFormat(d_opt)}
                        className="mr-1 accent-sky-500"
                      />
                      {t(d_opt) || d_opt}
                    </label>
                  ))}
                </fieldset>
              </div>
            )}
          </form>

          <div className="mt-8">
            {loading && <p className="text-center text-slate-500 dark:text-slate-400 py-4">{t('searchingInProgress') || 'Searching…'}</p>}
            {!loading && results.length === 0 && query && !loading && (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">{t('noResultsFound') || 'No results.'}</p>
            )}

            {results.map((r, i) => (
              <div key={`${r.reference}-${r.version}-${i}`} className="mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                <span 
                    onClick={() => {
                        const [book, chapterAndVerse] = r.reference.split(/\s+(?=\d)/);
                        if (book && chapterAndVerse) {
                            const [chapter, verseNum] = chapterAndVerse.split(':');
                            navigate(`/?book=${book.trim()}&chapter=${chapter}&verse=${verseNum}`);
                        } else {
                            console.warn("Could not parse reference for navigation:", r.reference);
                            toast({ title: "Navigation Error", description: "Could not parse reference to navigate.", variant: "destructive"});
                        }
                    }}
                    className="font-semibold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {r.reference} ({r.version ? r.version.toUpperCase() : 'N/A'})
                </span>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: highlight(r.text, query) }} />
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default BibleSearch;