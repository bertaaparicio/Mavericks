import { Link } from "react-router-dom";

/** Logotipo textual reutilizado en todas las páginas. */
export function Logo({ variant = "default" }) {
  return (
    <Link className={`logo logo--${variant}`} to="/" aria-label="TalentMatch AI">
      <img
        className="logo__image"
        src="/images/talentmatch-logo.svg"
        alt=""
        aria-hidden="true"
      />
      <span>TalentMatch <strong>AI</strong></span>
    </Link>
  );
}
