import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
    import { translations, getInitialLanguage } from '@/lib/translations';

    const LocalizationContext = createContext();

    export const LocalizationProvider = ({ children }) => {
      const [language, setLanguageState] = useState(getInitialLanguage());
      const [currentTranslations, setCurrentTranslations] = useState(translations[language] || translations.en);

      useEffect(() => {
        setCurrentTranslations(translations[language] || translations.en);
        localStorage.setItem('appLanguage', language);
      }, [language]);

      const t = useCallback((key, replacements = {}) => {
        let translation = currentTranslations[key] || translations.en[key] || key;
        Object.keys(replacements).forEach(placeholder => {
          const regex = new RegExp(`{{${placeholder}}}`, 'g');
          translation = translation.replace(regex, replacements[placeholder]);
        });
        return translation;
      }, [currentTranslations]);
      
      const setLanguage = (lang) => {
        if (translations[lang]) {
          setLanguageState(lang);
        } else {
          setLanguageState('en'); 
        }
      };

      return (
        <LocalizationContext.Provider value={{ t, language, setLanguage }}>
          {children}
        </LocalizationContext.Provider>
      );
    };

    export const useLocalization = () => {
      const context = useContext(LocalizationContext);
      if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
      }
      return context;
    };

