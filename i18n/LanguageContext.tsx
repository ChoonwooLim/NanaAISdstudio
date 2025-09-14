import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

type Translations = { [key: string]: string | Translations };

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
    t: (key: string, options?: { [key: string]: string | number | undefined }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: Translations, key: string): string | undefined => {
    return key.split('.').reduce<string | Translations | undefined>((acc, part) => {
        if (typeof acc === 'object' && acc !== null && part in acc) {
            return (acc as Translations)[part];
        }
        return undefined;
    }, obj) as string | undefined;
};

const languageToCodeMap: { [key: string]: string } = {
    'English': 'en',
    'Korean': 'ko',
    'Japanese': 'ja',
    'Spanish': 'es',
    'French': 'fr',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<string>(
        () => localStorage.getItem('artifex_language') || 'English'
    );
    const [translations, setTranslations] = useState<Translations | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadTranslations = async () => {
            const langCode = languageToCodeMap[language] || 'en';
            const path = `/i18n/translations/${langCode}.json`;
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (isMounted) {
                    setTranslations(data);
                }
            } catch (error) {
                console.error(`Could not load translations for ${language} (${path}). Falling back to English.`, error);
                if (isMounted && langCode !== 'en') {
                    // Try fetching English as a fallback
                    try {
                        const fallbackResponse = await fetch(`/i18n/translations/en.json`);
                        const fallbackData = await fallbackResponse.json();
                        setTranslations(fallbackData);
                    } catch (fallbackError) {
                        console.error('Failed to load fallback English translations.', fallbackError);
                        setTranslations({}); // Prevent app crash
                    }
                } else if (isMounted) {
                    setTranslations({}); // Prevent app crash if English fails
                }
            }
        };

        loadTranslations();

        return () => {
            isMounted = false;
        };
    }, [language]);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem('artifex_language', lang);
    };

    const t = useCallback((key: string, options?: { [key: string]: string | number | undefined }): string => {
        if (!translations) {
            return key; // Return key if translations are not loaded yet
        }

        let translation = getNestedValue(translations, key) || key;

        if (options) {
            Object.keys(options).forEach(optKey => {
                const regex = new RegExp(`{{${optKey}}}`, 'g');
                translation = translation.replace(regex, String(options[optKey] ?? ''));
            });
        }
        return translation;
    }, [translations]);
    
    // Render children only when translations are loaded to prevent flicker
    if (translations === null) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
