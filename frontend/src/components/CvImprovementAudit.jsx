const copy = {
  es: {
    eyebrow: "AUDITORÍA PRO DEL CV",
    title: "Cómo hacer que tu CV sea más competitivo",
    description: "Revisamos impacto, ATS, presentación profesional y lenguaje. El análisis de skill gaps se completará al conectar ofertas reales.",
    score: "Puntuación inicial",
    good: "Correcto",
    improve: "Mejorar",
    market: "Pendiente de ofertas",
    recommendation: "Recomendación",
    evidence: "Fragmentos detectados",
    pro: "FUNCIÓN PRO",
  },
  ca: {
    eyebrow: "AUDITORIA PRO DEL CV",
    title: "Com fer que el teu CV sigui més competitiu",
    description: "Revisem impacte, ATS, presentació professional i llenguatge. L’anàlisi de skill gaps es completarà en connectar ofertes reals.",
    score: "Puntuació inicial",
    good: "Correcte",
    improve: "Millorar",
    market: "Pendent d’ofertes",
    recommendation: "Recomanació",
    evidence: "Fragments detectats",
    pro: "FUNCIÓ PRO",
  },
  en: {
    eyebrow: "PRO RÉSUMÉ AUDIT",
    title: "How to make your résumé more competitive",
    description: "We review impact, ATS, professional presentation and language. Skill-gap analysis will be completed when real jobs are connected.",
    score: "Initial score",
    good: "Good",
    improve: "Improve",
    market: "Waiting for jobs",
    recommendation: "Recommendation",
    evidence: "Detected excerpts",
    pro: "PRO FEATURE",
  },
};

export function CvImprovementAudit({ audit, language }) {
  const t = copy[language];
  const statusLabel = {
    good: t.good,
    improve: t.improve,
    needs_market_data: t.market,
  };

  return (
    <section className="cv-audit">
      <div className="cv-audit__heading">
        <div>
          <span>{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>
        <div className="cv-audit__score">
          <strong>{audit.score}</strong>
          <span>/100</span>
          <small>{t.score}</small>
        </div>
      </div>

      <div className="cv-audit__grid">
        {audit.checks.map((check) => (
          <article className={`audit-card audit-card--${check.status}`} key={check.id}>
            <div className="audit-card__top">
              <span>{t.pro}</span>
              <small>{statusLabel[check.status]}</small>
            </div>
            <h3>{check.label}</h3>
            <p>{check.finding}</p>

            {check.recommendation && (
              <div className="audit-recommendation">
                <strong>{t.recommendation}</strong>
                <p>{check.recommendation}</p>
              </div>
            )}

            {!!check.evidence.length && (
              <details>
                <summary>{t.evidence}</summary>
                <ul>{check.evidence.map((line) => <li key={line}>{line}</li>)}</ul>
              </details>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
