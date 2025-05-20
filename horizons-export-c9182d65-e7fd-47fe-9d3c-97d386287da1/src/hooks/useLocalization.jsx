import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
    import { translations, getInitialLanguage as getInitialStoredLanguage } from '@/lib/translations';

    const LocalizationContext = createContext();

    export function LocalizationProvider({ children }) {
      const getInitialLanguage = () => {
        const storedLang = getInitialStoredLanguage(); 
        return translations[storedLang] ? storedLang : 'en'; 
      };

      const [language, setLanguage] = useState(getInitialLanguage());

      useEffect(() => {
        localStorage.setItem('appLanguage', language);
        document.documentElement.lang = language;
      }, [language]);

      const t = useCallback((key, params = {}) => {
        let string = translations[language]?.[key] || translations['en']?.[key] || key;
        Object.keys(params).forEach(paramKey => {
          string = string.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
        });
        return string;
      }, [language]);
      
      const contextValue = useMemo(() => ({
        t,
        language,
        setLanguage,
        availableLanguages: Object.keys(translations)
      }), [t, language, setLanguage]);

      return (
        <LocalizationContext.Provider value={contextValue}>
          {children}
        </LocalizationContext.Provider>
      );
    }

    export function useLocalization() {
      const context = useContext(LocalizationContext);
      if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
      }
      return context;
    }