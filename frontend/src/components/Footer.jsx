import { Logo } from "./Logo";

const copy = {
  ca: { privacy: "Privacitat", terms: "Termes", contact: "Contacte i suport", social: "Xarxes socials" },
  es: { privacy: "Privacidad", terms: "Términos", contact: "Contacto y soporte", social: "Redes sociales" },
  en: { privacy: "Privacy", terms: "Terms", contact: "Contact and support", social: "Social media" },
};

export function Footer({ language }) {
  const t = copy[language];
  return (
    <footer className="site-footer">
      <Logo />
      <nav>
        <a href="#privacy">{t.privacy}</a>
        <a href="#terms">{t.terms}</a>
        <a href="mailto:soporte@talentmatch.ai">{t.contact}</a>
        <a href="#social">{t.social}</a>
      </nav>
      <span>© 2026 TalentMatch AI</span>
    </footer>
  );
}
