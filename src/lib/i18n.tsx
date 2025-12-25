'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import it from '../locales/it.json';

type Language = 'en' | 'it';
type Translations = typeof en;

interface i18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string, variables?: Record<string, string>) => string;
}

const translations: Record<Language, Translations> = { en, it };
const i18nContext = createContext<i18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Load language from localStorage if available
    useEffect(() => {
        const saved = localStorage.getItem('app-language') as Language;
        if (saved && (saved === 'en' || saved === 'it')) {
            setLanguage(saved);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('app-language', lang);
    };

    const t = (path: string, variables?: Record<string, string>) => {
        const keys = path.split('.');
        let value: any = translations[language];

        for (const key of keys) {
            if (value[key] === undefined) {
                // Fallback to English if key missing in current language
                let fallback: any = translations['en'];
                for (const fKey of keys) {
                    fallback = fallback?.[fKey];
                }
                value = fallback || path;
                break;
            }
            value = value[key];
        }

        if (typeof value !== 'string') return path;

        if (variables) {
            Object.entries(variables).forEach(([key, val]) => {
                value = value.replace(`{{${key}}}`, val);
            });
        }

        return value;
    };

    return (
        <i18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </i18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(i18nContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within an i18nProvider');
    }
    return context;
}
