import { useState, useCallback } from 'react';

export type Language = 'en' | 'hi';

export interface LanguageConfig {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'import': 'Import',

    // Admin specific
    'admin.dashboard': 'Dashboard',
    'admin.users': 'User Management',
    'admin.devices': 'Device Management',
    'admin.audit': 'Audit Logs',
    'admin.reports': 'Reports',
    'admin.config': 'Configuration',

    // Generic phrases
    'welcome': 'Welcome',
    'settings': 'Settings',
    'profile': 'Profile',
    'logout': 'Logout',
  },
  hi: {
    // Common
    'loading': 'लोड हो रहा है...',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'delete': 'हटाएं',
    'edit': 'संपादित करें',
    'view': 'देखें',
    'search': 'खोजें',
    'filter': 'फिल्टर',
    'export': 'निर्यात',
    'import': 'आयात',

    // Admin specific
    'admin.dashboard': 'डैशबोर्ड',
    'admin.users': 'उपयोगकर्ता प्रबंधन',
    'admin.devices': 'डिवाइस प्रबंधन',
    'admin.audit': 'ऑडिट लॉग',
    'admin.reports': 'रिपोर्ट',
    'admin.config': 'कॉन्फ़िगरेशन',

    // Generic phrases
    'welcome': 'स्वागत है',
    'settings': 'सेटिंग्स',
    'profile': 'प्रोफाइल',
    'logout': 'लॉग आउट',
  }
};

export const useLanguage = (): LanguageConfig => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('saubhagya-language');
    return (stored as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('saubhagya-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const translation = translations[language]?.[key as keyof typeof translations[typeof language]];
    return translation || key;
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
};