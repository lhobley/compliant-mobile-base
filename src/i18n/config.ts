import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
// In a real app, these would be lazy loaded via http-backend, but for this demo we import directly
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

// Configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
