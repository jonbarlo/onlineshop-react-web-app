import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Debug logging
  console.log('LanguageSwitcher - Current i18n.language:', i18n.language);
  console.log('LanguageSwitcher - i18n.isInitialized:', i18n.isInitialized);

  const languages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-CR', name: 'Español', flag: '🇨🇷' },
  ];

  const handleLanguageChange = async (languageCode: string) => {
    console.log('Changing language to:', languageCode);
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('i18nextLng', languageCode);
      setIsOpen(false);
      console.log('Language changed successfully to:', i18n.language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages.find(lang => lang.code === 'es-CR') || languages[1]; // Default to Spanish

  return (
    <div className={`relative ${className}`}>
      <button 
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentLanguage.flag}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                  i18n.language === language.code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {i18n.language === language.code && (
                  <span className="ml-auto text-xs text-gray-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
