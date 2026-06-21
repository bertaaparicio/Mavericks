import { Link } from "react-router-dom";

/** Tarjeta de acceso para candidatos o empresas. */
export function AudienceCard({ type, image, label, title, pain, benefits, cta, microcopy, to }) {
  return (
    <article className={`audience-card audience-card--${type}`}>
      <div className={`audience-card__scene audience-card__scene--${type}`} aria-hidden="true">
        {/* Las capas decorativas crean movimiento sin cargar un vídeo pesado. */}
        {type === "candidate" && <span className="rocket-trail" />}
        {type === "company" && (
          <>
            <span className="building-scan building-scan--one" />
            <span className="building-scan building-scan--two" />
          </>
        )}
        <img className="audience-card__animated-image" src={image} alt="" />
      </div>
      <div className="audience-card__content">
        <span className="audience-card__label">{label}</span>
        <h3>{title}</h3>
        <p className="audience-card__pain">{pain}</p>
        <ul>
          {benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>
        <Link className={`button button--${type}`} to={to}>{cta}</Link>
        <small>{microcopy}</small>
      </div>
    </article>
  );
}
