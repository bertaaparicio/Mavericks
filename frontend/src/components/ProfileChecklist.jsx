import { useMemo, useState } from "react";

const copy = {
  es: {
    eyebrow: "CHECKLIST DEL PERFIL",
    title: "Información necesaria para buscar ofertas",
    description: "Hemos completado lo que aparece en tu CV. Responde o confirma únicamente los campos pendientes.",
    free: "Plan Free",
    pro: "Plan PRO",
    completed: "Completado",
    uncertain: "Por confirmar",
    missing: "Pendiente",
    detected: "Detectado en el CV",
    progress: "campos completados",
    pending: "preguntas necesarias",
    proOnly: "Incluido en PRO",
    placeholder: "Escribe tu respuesta...",
    save: "Guardar respuestas",
    saved: "Respuestas guardadas localmente.",
    noQuestions: "No quedan preguntas obligatorias para este plan.",
  },
  ca: {
    eyebrow: "CHECKLIST DEL PERFIL",
    title: "Informació necessària per buscar ofertes",
    description: "Hem completat el que apareix al teu CV. Respon o confirma només els camps pendents.",
    free: "Pla Free",
    pro: "Pla PRO",
    completed: "Completat",
    uncertain: "Per confirmar",
    missing: "Pendent",
    detected: "Detectat al CV",
    progress: "camps completats",
    pending: "preguntes necessàries",
    proOnly: "Inclòs a PRO",
    placeholder: "Escriu la teva resposta...",
    save: "Desar respostes",
    saved: "Respostes desades localment.",
    noQuestions: "No queden preguntes obligatòries per a aquest pla.",
  },
  en: {
    eyebrow: "PROFILE CHECKLIST",
    title: "Information required to find matching jobs",
    description: "We completed what appears in your résumé. Answer or confirm only the pending fields.",
    free: "Free plan",
    pro: "PRO plan",
    completed: "Completed",
    uncertain: "Needs confirmation",
    missing: "Pending",
    detected: "Detected in résumé",
    progress: "fields completed",
    pending: "required questions",
    proOnly: "Included in PRO",
    placeholder: "Enter your answer...",
    save: "Save answers",
    saved: "Answers saved locally.",
    noQuestions: "No required questions remain for this plan.",
  },
};

function displayValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value ?? "");
}

/** Visualitza el JSON retornat per l'agent lector i recull les dades que falten. */
export function ProfileChecklist({ checklist, language }) {
  const t = copy[language];
  const [plan, setPlan] = useState("free");
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);

  const visibleSections = useMemo(
    () => checklist.sections.filter((section) => section.plans.includes(plan)),
    [checklist, plan],
  );

  const requiredPending = checklist.next_questions[plan].filter(
    (field) => !answers[field.key]?.trim(),
  );
  const answeredVisible = visibleSections.reduce(
    (total, section) => total + section.fields.filter(
      (field) => field.status !== "completed" && answers[field.key]?.trim(),
    ).length,
    0,
  );
  const completed = visibleSections.reduce((total, section) => total + section.completed, 0)
    + answeredVisible;
  const total = visibleSections.reduce((sum, section) => sum + section.total, 0);

  function saveAnswers() {
    localStorage.setItem(
      `talentmatch-checklist-${plan}`,
      JSON.stringify({ answers, savedAt: new Date().toISOString() }),
    );
    setSaved(true);
  }

  return (
    <section className="profile-checklist">
      <div className="checklist-heading">
        <div>
          <span>{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>
        <div className="checklist-plan-switch">
          <button
            className={plan === "free" ? "is-active" : ""}
            type="button"
            onClick={() => { setPlan("free"); setSaved(false); }}
          >
            {t.free}
          </button>
          <button
            className={plan === "pro" ? "is-active" : ""}
            type="button"
            onClick={() => { setPlan("pro"); setSaved(false); }}
          >
            {t.pro}
          </button>
        </div>
      </div>

      <div className="checklist-summary">
        <div>
          <strong>{completed}/{total}</strong>
          <span>{t.progress}</span>
        </div>
        <div>
          <strong>{requiredPending.length}</strong>
          <span>{t.pending}</span>
        </div>
        <div className="checklist-progress" aria-hidden="true">
          <span style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="checklist-sections">
        {visibleSections.map((section) => (
          <details className="checklist-section" key={section.id} open={section.priority === "maximum"}>
            <summary>
              <span>{section.label}</span>
              <small>{section.completed}/{section.total}</small>
            </summary>
            <div className="checklist-fields">
              {section.fields.map((field) => {
                const hasAnswer = Boolean(answers[field.key]?.trim());
                const effectiveStatus = hasAnswer ? "completed" : field.status;
                return (
                  <div className={`checklist-field checklist-field--${effectiveStatus}`} key={field.key}>
                    <div className="checklist-field__top">
                      <span className={`status-dot status-dot--${effectiveStatus}`} />
                      <strong>
                        {effectiveStatus === "completed"
                          ? t.completed
                          : effectiveStatus === "uncertain"
                            ? t.uncertain
                            : t.missing}
                      </strong>
                      {section.priority !== "maximum" && <small>{t.proOnly}</small>}
                    </div>

                    {field.status === "completed" && !hasAnswer ? (
                      <>
                        <p>{displayValue(field.value)}</p>
                        <small className="detected-source">{t.detected} · {Math.round(field.confidence * 100)}%</small>
                      </>
                    ) : (
                      <label>
                        <span>{field.question}</span>
                        <input
                          value={answers[field.key] || ""}
                          placeholder={field.value ? displayValue(field.value) : t.placeholder}
                          onChange={(event) => {
                            setAnswers((current) => ({ ...current, [field.key]: event.target.value }));
                            setSaved(false);
                          }}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>

      {requiredPending.length === 0 ? (
        <p className="checklist-complete-message">{t.noQuestions}</p>
      ) : (
        <button className="button button--candidate checklist-save" type="button" onClick={saveAnswers}>
          {t.save}
        </button>
      )}
      {saved && <p className="checklist-saved">{t.saved}</p>}
    </section>
  );
}
