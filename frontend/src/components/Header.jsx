import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";

const labels = {
  ca: { how: "Com funciona", pricing: "Preus", login: "Login", logout: "Tancar sessió", company: "Accés empreses" },
  es: { how: "Cómo funciona", pricing: "Precios", login: "Login", logout: "Cerrar sesión", company: "Acceso Empresas" },
  en: { how: "How it works", pricing: "Pricing", login: "Login", logout: "Log out", company: "Company access" },
};

export function Header({ language, portal }) {
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