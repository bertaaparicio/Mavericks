import { useLanguage } from "../context/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      className="language-selector"
      aria-label="Idioma"
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
    >
      <option value="ca">CAT</option>
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  );
}
