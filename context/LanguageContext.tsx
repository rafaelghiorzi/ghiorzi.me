'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { dictionary, Lang } from '@/data/dictionary';

interface LanguageContextProps {
  lang: Lang;
  toggleLang: () => void;
  t: typeof dictionary['pt'];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('pt');
  
  const toggleLang = () => setLang((prev) => (prev === 'pt' ? 'en' : 'pt'));
  const t = dictionary[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
};