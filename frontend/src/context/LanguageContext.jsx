import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

/**
 * Mantiene el idioma compartido entre todas las rutas.
 * La selección se conserva al cerrar o recargar el navegador.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem("talentmatch-language") || "es",
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage(nextLanguage) {
        localStorage.setItem("talentmatch-language", nextLanguage);
        document.documentElement.lang = nextLanguage;
        setLanguageState(nextLanguage);
      },
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
