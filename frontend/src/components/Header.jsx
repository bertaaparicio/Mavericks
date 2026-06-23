import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { Logo } from "./Logo";

const labels = {
  ca: {
    companies: "Per a companyies",
    recruiters: "Per a reclutadors",
    how: "Com funciona",
    pricing: "Preus",
    login: "Login",
    logout: "Tancar sessió",
    company: "Accés empreses"
  },
  es: {
    companies: "Para compañías",
    recruiters: "Para reclutadores",
    how: "Cómo funciona",
    pricing: "Precios",
    login: "Login",
    logout: "Cerrar sesión",
    company: "Acceso Empresas"
  },
  en: {
    companies: "For companies",
    recruiters: "For recruiters",
    how: "How it works",
    pricing: "Pricing",
    login: "Login",
    logout: "Log out",
    company: "Company access"
  },
};

export function Header({ portal }) {
  const { language } = useLanguage();
  const t = labels[language];
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const isHowActive = pathname === "/" && hash === "#como-funciona";
  const isLoggedIn = localStorage.getItem("talentmatch-user");

  function handleLogout() {
    localStorage.removeItem("talentmatch-user");
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="site-header__left">
        <Logo variant={portal || "default"} />
        <nav className="site-nav" aria-label="Navegación principal">
          <Link
            className={pathname === "/company" && hash !== "#courses" ? "nav-link is-active" : "nav-link"}
            to="/company#jobs"
            aria-current={pathname === "/company" && hash !== "#courses" ? "page" : undefined}
          >
            {t.companies}
          </Link>
          <Link
            className={pathname === "/company" && hash === "#courses" ? "nav-link is-active" : "nav-link"}
            to="/company#courses"
            aria-current={pathname === "/company" && hash === "#courses" ? "page" : undefined}
          >
            {t.recruiters}
          </Link>
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
        </nav>
      </div>

      <nav className="site-nav" aria-label="Navegación de usuario">
        {isLoggedIn ? (
          <button className="nav-link" onClick={handleLogout}>
            {t.logout}
          </button>
        ) : (
          <Link
            className={pathname === "/login" ? "nav-link is-active" : "nav-link"}
            to="/login"
            aria-current={pathname === "/login" ? "page" : undefined}
          >
            {t.login}
          </Link>
        )}

        <LanguageSelector />

        {/* Botón de empresas solo visible si NO está logueado */}
        {!isLoggedIn && (
          <Link
            className={`button button--outline${pathname === "/company" ? " is-active" : ""}`}
            to="/company"
            aria-current={pathname === "/company" ? "page" : undefined}
          >
            {t.company}
          </Link>
        )}
      </nav>
    </header>
  );
}
