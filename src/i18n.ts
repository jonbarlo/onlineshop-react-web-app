import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get language from environment variable
const envLanguage = import.meta.env.VITE_LANGUAGE || 'es-CR'; // Default to Spanish Costa Rica

console.log('Environment language:', envLanguage);
console.log('Available languages:', ['en-US', 'es-CR']);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: envLanguage, // Set initial language
    fallbackLng: 'es-CR', // Fallback to Spanish Costa Rica
    debug: import.meta.env.DEV,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['localStorage', 'querystring', 'cookie', 'sessionStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupSessionStorage: 'i18nextLng',
    },
  });

// Force set the language from environment variable
i18n.changeLanguage(envLanguage).then(() => {
  console.log('Language changed to:', i18n.language);
  // Store in localStorage to persist
  localStorage.setItem('i18nextLng', envLanguage);
});

export default i18n;
