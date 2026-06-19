import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";

const labels = {
  ca: { how: "Com funciona", pricing: "Preus", login: "Login", company: "Accés empreses", switch: "Canviar perfil" },
  es: { how: "Cómo funciona", pricing: "Precios", login: "Login", company: "Acceso Empresas", switch: "Cambiar perfil" },
  en: { how: "How it works", pricing: "Pricing", login: "Login", company: "Company access", switch: "Switch profile" },
};

export function Header({ language, portal }) {
  const t = labels[language];

  return (
    <header className="site-header">
      <Logo variant={portal || "default"} />
      <nav className="site-nav" aria-label="Navegación principal">
        {!portal && <a href="#como-funciona">{t.how}</a>}
        <Link to="/pricing">{t.pricing}</Link>
        {!portal && <Link to="/login">{t.login}</Link>}
        <LanguageSelector />
        {portal ? (
          <Link className="button button--outline" to="/">{t.switch}</Link>
        ) : (
          <Link className="button button--outline" to="/company">{t.company}</Link>
        )}
      </nav>
    </header>
  );
}
