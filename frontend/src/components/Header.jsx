import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";

const labels = {
  ca: { how: "Com funciona", pricing: "Preus", login: "Login", company: "Accés empreses" },
  es: { how: "Cómo funciona", pricing: "Precios", login: "Login", company: "Acceso Empresas" },
  en: { how: "How it works", pricing: "Pricing", login: "Login", company: "Company access" },
};

/** Header compartido y consistente en todas las páginas de la aplicación. */
export function Header({ language, portal }) {
  const t = labels[language];
  const { pathname, hash } = useLocation();
  const isHowActive = pathname === "/" && hash === "#como-funciona";

  return (
    <header className="site-header">
      <Logo variant={portal || "default"} />
      <nav className="site-nav" aria-label="Navegación principal">
        <Link
          className={isHowActive ? "nav-link is-active" : "nav-link"}
          to="/#como-funciona"
          aria-current={isHowActive ? "page" : undefined}
        >
          {t.how}
        </Link>

        <Link
          className={pathname === "/pricing" ? "nav-link is-active" : "nav-link"}
          to="/pricing"
          aria-current={pathname === "/pricing" ? "page" : undefined}
        >
          {t.pricing}
        </Link>

        <Link
          className={pathname === "/login" ? "nav-link is-active" : "nav-link"}
          to="/login"
          aria-current={pathname === "/login" ? "page" : undefined}
        >
          {t.login}
        </Link>

        <LanguageSelector />

        <Link
          className={`button button--outline${pathname === "/company" ? " is-active" : ""}`}
          to="/company"
          aria-current={pathname === "/company" ? "page" : undefined}
        >
          {t.company}
        </Link>
      </nav>
    </header>
  );
}
