import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageDebug: React.FC = () => {
  const { i18n, t } = useTranslation();

  if (import.meta.env.PROD) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg text-xs z-50">
      <div>Current Language: {i18n.language}</div>
      <div>Available: {i18n.languages?.join(', ')}</div>
      <div>Test: {t('site.name')}</div>
      <div>Env: {import.meta.env.VITE_LANGUAGE}</div>
    </div>
  );
};
