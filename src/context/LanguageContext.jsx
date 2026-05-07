import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LanguageContext = createContext(null);

function applyGoogleTranslate(targetLang) {
  const doIt = () => {
    const select = document.querySelector('.goog-te-combo');
    if (!select) return false;
    select.value = targetLang === 'ar' ? 'ar' : '';
    select.dispatchEvent(new Event('change'));
    return true;
  };

  if (!doIt()) {
    let tries = 0;
    const id = setInterval(() => {
      if (doIt() || ++tries > 25) clearInterval(id);
    }, 200);
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('site_lang') || 'en');

  useEffect(() => {
    if (lang === 'ar') {
      // Re-apply after any route change (Google Translate persists via cookie but
      // the widget may need a nudge after React Router swaps the DOM)
      const t = setTimeout(() => applyGoogleTranslate('ar'), 400);
      return () => clearTimeout(t);
    }
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem('site_lang', next);
      applyGoogleTranslate(next);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
