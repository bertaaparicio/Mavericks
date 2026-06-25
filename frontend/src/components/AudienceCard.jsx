import { Link } from "react-router-dom";

export function AudienceCard({
  type,
  image,
  label,
  title,
  pain,
  benefits,
  cta,
  microcopy,
  to,
}) {
  return (
    <Link className={`audience-card audience-card--${type}`} to={to}>
      <div className="audience-card__content">
        <h3>{title}</h3>
        <p className="audience-card__pain">{pain}</p>
        <ul>
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
