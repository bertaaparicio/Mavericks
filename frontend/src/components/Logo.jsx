import { Link } from "react-router-dom";

/** Logotipo textual reutilizado en todas las páginas. */
export function Logo({ variant = "default" }) {
  const isPro = localStorage.getItem("talentmatch-plan") === "pro";

  return (
    <Link className={`logo logo--${variant}`} to="/" aria-label="TalentMatch AI">
      <img
        className="logo__image"
        src="/images/talentmatch-logo.svg"
        alt=""
        aria-hidden="true"
      />
      <span className="logo__text">
        TalentMatch <strong>AI</strong>
        {isPro && <span className="logo__pro">PRO</span>}
      </span>
    </Link>
  );
}