import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-surface p-1 shadow-sm border border-secondary/50">
      {['en', 'vi'].map((lang) => {
        const isActive = i18n.language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => changeLanguage(lang)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wider transition-colors z-10 ${
              isActive ? 'text-surface' : 'text-textMuted hover:text-textMain'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 -z-10 rounded-full bg-accent shadow-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            {lang}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
