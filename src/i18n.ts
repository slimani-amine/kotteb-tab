import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from "./translations/en.json";
import frTranslation from "./translations/fr.json";
import arTranslation from "./translations/ar.json";
import enQuran from "./translations/quran/en.json";
import arQuran from "./translations/quran/ar.json";

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof enTranslation;
      quran: typeof enQuran;
    };
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        common: enTranslation,
        quran: enQuran
      },
      fr: { 
        common: frTranslation 
      },
      ar: { 
        common: arTranslation,
        quran: arQuran
      },
    },
    ns: ['common', 'quran'],
    defaultNS: 'common',
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
