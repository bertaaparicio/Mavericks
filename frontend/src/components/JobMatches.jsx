import { useMemo, useState } from "react";

const copy = {
  es: {
    eyebrow: "OFERTAS RECOMENDADAS",
    title: "Empleos que encajan con tu perfil",
    minimum: "Encaje mínimo",
    empty: "No hemos encontrado ofertas por encima de este porcentaje.",
    company: "Empresa",
    location: "Ubicación",
    seniority: "Nivel",
    type: "Contrato",
    why: "Por qué encaja",
    strengths: "Puntos fuertes",
    missing: "Para subir el match",
    tip: "Tip TalentMatch",
    freeNote: "El plan PRO mostrará el desglose de requisitos y las competencias que faltan.",
    proNote: "El desglose detallado de requisitos se incorporará al ampliar los datos de las ofertas.",
  },
  ca: {
    eyebrow: "OFERTES RECOMANADES",
    title: "Feines que encaixen amb el teu perfil",
    minimum: "Encaix mínim",
    empty: "No hem trobat ofertes per sobre d’aquest percentatge.",
    company: "Empresa",
    location: "Ubicació",
    seniority: "Nivell",
    type: "Contracte",
    why: "Per què encaixa",
    strengths: "Punts forts",
    missing: "Per pujar el match",
    tip: "Tip TalentMatch",
    freeNote: "El pla PRO mostrarà el desglossament de requisits i les competències que falten.",
    proNote: "El desglossament detallat s’incorporarà en ampliar les dades de les ofertes.",
  },
  en: {
    eyebrow: "RECOMMENDED JOBS",
    title: "Jobs that match your profile",
    minimum: "Minimum match",
    empty: "No jobs were found above this percentage.",
    company: "Company",
    location: "Location",
    seniority: "Level",
    type: "Employment",
    why: "Why it fits",
    strengths: "Strengths",
    missing: "To raise the match",
    tip: "TalentMatch tip",
    freeNote: "The PRO plan will show requirement details and missing skills.",
    proNote: "Detailed requirements will be added when richer job data is available.",
  },
};

export function JobMatches({ jobs = [], language, plan }) {
  const t = copy[language];
  const [minimumScore, setMinimumScore] = useState(50);
  const visibleJobs = useMemo(
    () => jobs.filter((job) => Number(job.match_ratio || 0) >= minimumScore),
    [jobs, minimumScore],
  );

  return (
    <section className="job-matches">
      <div className="job-matches__heading">
        <div>
          <span>{t.eyebrow}</span>
          <h2>{t.title}</h2>
        </div>
        <label className="match-filter">
          <span>{t.minimum}: <strong>{minimumScore}%</strong></span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minimumScore}
            onChange={(event) => setMinimumScore(Number(event.target.value))}
          />
        </label>
      </div>

      {visibleJobs.length ? (
        <div className="job-matches__grid">
          {visibleJobs.map((job, index) => (
            <article className="job-match-card" key={`${job.company_name}-${job.job_title}-${index}`}>
              <div className="job-match-card__score">
                <strong>{Math.round(job.match_ratio || 0)}%</strong>
                <span>match</span>
              </div>
              <h3>{job.job_title}</h3>
              <dl>
                <div><dt>{t.company}</dt><dd>{job.company_name || "—"}</dd></div>
                <div><dt>{t.location}</dt><dd>{job.location || "—"}</dd></div>
                <div><dt>{t.seniority}</dt><dd>{job.seniority_level || "—"}</dd></div>
                <div><dt>{t.type}</dt><dd>{job.employment_type || "—"}</dd></div>
              </dl>
              {job.match_explanation && (
                <div className="job-match-story">
                  {job.match_explanation.why_it_fits && (
                    <div>
                      <strong>{t.why}</strong>
                      <p>{job.match_explanation.why_it_fits}</p>
                    </div>
                  )}
                  {!!job.match_explanation.strengths?.length && (
                    <div>
                      <strong>{t.strengths}</strong>
                      <ul>
                        {job.match_explanation.strengths.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {plan === "pro" && !!job.match_explanation.missing?.length && (
                    <div>
                      <strong>{t.missing}</strong>
                      <ul>
                        {job.match_explanation.missing.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {job.match_explanation.final_tip && (
                    <div>
                      <strong>{t.tip}</strong>
                      <p>{job.match_explanation.final_tip}</p>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="job-matches__empty">{t.empty}</p>
      )}

      <p className="job-matches__note">{plan === "pro" ? t.proNote : t.freeNote}</p>
    </section>
  );
}
