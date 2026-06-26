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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const visibleJobs = useMemo(
    () => jobs.filter((job) => Number(job.match_ratio || 0) >= minimumScore),
    [jobs, minimumScore],
  );

  const activeJob = visibleJobs[selectedIndex] || visibleJobs[0] || null;

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
            onChange={(event) => {
              setMinimumScore(Number(event.target.value));
              setSelectedIndex(0);
            }}
          />
        </label>
      </div>

      {visibleJobs.length ? (
        <div className="job-matches__glassdoor-layout">
          {/* Left panel: List of job previews */}
          <div className="job-matches__list-pane">
            {visibleJobs.map((job, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  className={`job-item-card ${isActive ? "is-active" : ""}`}
                  key={`${job.company_name}-${job.job_title}-${index}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="job-item-card__header">
                    <div className="job-item-card__score-badge">
                      <strong>{Math.round(job.match_ratio || 0)}%</strong>
                    </div>
                    <div className="job-item-card__meta">
                      <h4>{job.job_title}</h4>
                      <span className="job-item-card__company">{job.company_name || "—"}</span>
                    </div>
                  </div>
                  <div className="job-item-card__details-row">
                    <span>📍 {job.location || "—"}</span>
                    <span>💼 {job.seniority_level || "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right panel: Active job details */}
          {activeJob ? (
            <div className="job-matches__details-pane">
              <div className="job-details-header">
                <div className="job-details-header__main">
                  <h2>{activeJob.job_title}</h2>
                  <div className="job-details-header__subtitle">{activeJob.company_name}</div>
                  <div className="job-details-metadata">
                    <span>📍 {activeJob.location || "—"}</span>
                    <span>💼 {activeJob.seniority_level || "—"}</span>
                    <span>⏰ {activeJob.employment_type || "—"}</span>
                    <span>🏭 {activeJob.industry || "—"}</span>
                  </div>
                </div>
                <div className="job-details-header__match">
                  <div className="match-circle">
                    <strong>{Math.round(activeJob.match_ratio || 0)}%</strong>
                    <span>match</span>
                  </div>
                </div>
              </div>

              {activeJob.match_explanation ? (
                <div className="job-details-body">
                  {activeJob.match_explanation.why_it_fits && (
                    <div>
                      <strong>{t.why}</strong>
                      <p>{activeJob.match_explanation.why_it_fits}</p>
                    </div>
                  )}
                  {!!activeJob.match_explanation.strengths?.length && (
                    <div>
                      <strong>{t.strengths}</strong>
                      <ul>
                        {activeJob.match_explanation.strengths.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {plan === "pro" && !!activeJob.match_explanation.missing?.length && (
                    <div>
                      <strong>{t.missing}</strong>
                      <ul>
                        {activeJob.match_explanation.missing.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeJob.match_explanation.final_tip && (
                    <div>
                      <strong>{t.tip}</strong>
                      <p>{activeJob.match_explanation.final_tip}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="job-matches__empty">{t.empty}</p>
              )}
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              {t.empty}
            </div>
          )}
        </div>
      ) : (
        <p className="job-matches__empty">{t.empty}</p>
      )}

      <p className="job-matches__note">{plan === "pro" ? t.proNote : t.freeNote}</p>
    </section>
  );
}
