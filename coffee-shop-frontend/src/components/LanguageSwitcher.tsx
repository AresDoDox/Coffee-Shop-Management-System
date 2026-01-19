import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-300">
      <button
        type="button"
        onClick={() => changeLanguage('vi')}
        className={`px-3 py-1 font-medium transition-colors ${i18n.language === 'vi' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 font-medium transition-colors ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
