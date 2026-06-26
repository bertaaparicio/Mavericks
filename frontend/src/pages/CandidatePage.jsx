import { useState } from "react";
import { CvImprovementAudit } from "../components/CvImprovementAudit";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { JobMatches } from "../components/JobMatches";
import { ProfileChecklist } from "../components/ProfileChecklist";
import { useLanguage } from "../context/LanguageContext";
import {
  analyzeCv,
  answerCvQa,
  completeProfile,
  initCvQa,
  matchFromProfile,
} from "../services/api";

const copy = {
  es: {
    title: "Tu talento merece el match perfecto.",
    text: "Sube tu currículum y analizaremos tu experiencia, formación y competencias.",
    drop: "Selecciona o arrastra tu CV",
    formats: "PDF o DOCX · Máximo 10 MB",
    button: "Analizar mi CV",
    loading: "Leyendo el CV...",
    summary: "Esto es lo que hemos entendido",
    points: "Puntos clave",
    skills: "Competencias",
    languages: "Idiomas",
    preview: "Texto extraído",
    error: "Selecciona un PDF o DOCX válido.",
    selectMode: "Elige el método de análisis",
    modeStandard: "📋 Formulario Checklist (Rápido)",
    modeStandardDesc:
      "Extrae datos de tu CV al instante y completa los campos que falten en un formulario.",
    modeInteractive: "💬 Entrevista con Agente IA (Recomendado)",
    modeInteractiveDesc:
      "Habla con nuestro Agente de IA para aclarar tu perfil de forma natural antes de buscar ofertas.",
    startChat: "Iniciar entrevista",
    interviewActive: "Entrevista en curso con el Agente TalentMatch AI",
    chatInputPlaceholder: "Escribe tu respuesta aquí...",
    send: "Enviar",
    loadingAgent: "El Agente está analizando...",
    qaFinished:
      "¡Excelente! Hemos recopilado todo el contexto necesario. Buscando tus matches ideales...",
    profileExtracted: "Perfil de búsqueda completado por el Agente",
    labelTitle: "Palabras clave",
    labelSeniority: "Nivel",
    labelLocation: "Ubicación",
    labelFunction: "Función",
    labelIndustry: "Sector",
    labelType: "Jornada",
    cancel: "Cancelar",
  },
  ca: {
    title: "El teu talent mereix el match perfecte.",
    text: "Puja el teu currículum i analitzarem la teva experiència, formació i competències.",
    drop: "Selecciona o arrossega el teu CV",
    formats: "PDF o DOCX · Màxim 10 MB",
    button: "Analitzar el meu CV",
    loading: "Llegint el CV...",
    summary: "Això és el que hem entès",
    points: "Punts clau",
    skills: "Competències",
    languages: "Idiomes",
    preview: "Text extret",
    error: "Selecciona un PDF o DOCX vàlid.",
    selectMode: "Tria el mètode d'anàlisi",
    modeStandard: "📋 Formulari Checklist (Ràpid)",
    modeStandardDesc:
      "Extreu dades del teu CV a l'instant i completa els camps que faltin en un formulari.",
    modeInteractive: "💬 Entrevista amb Agent IA (Recomanat)",
    modeInteractiveDesc:
      "Parla amb el nostre Agent d'IA per aclarir el teu perfil de forma natural abans de buscar ofertes.",
    startChat: "Iniciar entrevista",
    interviewActive: "Entrevista en curs amb l'Agent TalentMatch AI",
    chatInputPlaceholder: "Escriu la teva resposta aquí...",
    send: "Enviar",
    loadingAgent: "L'Agent està analitzant...",
    qaFinished:
      "Excel·lent! Hem recopilat tot el context necessari. Buscant els teus matches ideals...",
    profileExtracted: "Perfil de cerca completat per l'Agent",
    labelTitle: "Paraules clau",
    labelSeniority: "Nivell",
    labelLocation: "Ubicació",
    labelFunction: "Funció",
    labelIndustry: "Sector",
    labelType: "Jornada",
    cancel: "Cancel·lar",
  },
  en: {
    title: "Your talent deserves the perfect match.",
    text: "Upload your résumé and we will analyze your experience, education and skills.",
    drop: "Select or drag your résumé",
    formats: "PDF or DOCX · Maximum 10 MB",
    button: "Analyze my résumé",
    loading: "Reading résumé...",
    summary: "This is what we understood",
    points: "Key points",
    skills: "Skills",
    languages: "Languages",
    preview: "Extracted text",
    error: "Select a valid PDF or DOCX.",
    selectMode: "Choose analysis method",
    modeStandard: "📋 Checklist Form (Fast)",
    modeStandardDesc:
      "Extracts data from your CV instantly and let you fill out the rest in a checklist form.",
    modeInteractive: "💬 AI Agent Interview (Recommended)",
    modeInteractiveDesc:
      "Talk to our AI Agent to clarify your profile naturally before searching for matching jobs.",
    startChat: "Start interview",
    interviewActive: "Interview in progress with TalentMatch AI Agent",
    chatInputPlaceholder: "Type your answer here...",
    send: "Send",
    loadingAgent: "The Agent is analyzing...",
    qaFinished:
      "Excellent! We gathered all the required context. Finding your ideal job matches...",
    profileExtracted: "Job search profile completed by the Agent",
    labelTitle: "Job keywords",
    labelSeniority: "Seniority",
    labelLocation: "Location",
    labelFunction: "Function",
    labelIndustry: "Industry",
    labelType: "Employment",
    cancel: "Cancel",
  },
};

export function CandidatePage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("free");

  // Q&A Agent states
  const [analysisMode, setAnalysisMode] = useState("interactive");
  const [qaSessionId, setQaSessionId] = useState(null);
  const [qaHistory, setQaHistory] = useState([]);
  const [qaCurrentQuestion, setQaCurrentQuestion] = useState(null);
  const [qaInput, setQaInput] = useState("");
  const [qaComplete, setQaComplete] = useState(false);
  const [qaProfile, setQaProfile] = useState(null);
  const [qaJobs, setQaJobs] = useState([]);

  async function submit(event) {
    event.preventDefault();
    if (!file || !/\.(pdf|docx)$/i.test(file.name)) {
      setMessage(t.error);
      return;
    }
    setLoading(true);
    setMessage("");
    setQaSessionId(null);
    setQaHistory([]);
    setQaCurrentQuestion(null);
    setQaInput("");
    setQaComplete(false);
    setQaProfile(null);
    setQaJobs([]);
    setResult(null);

    if (analysisMode === "interactive") {
      try {
        const response = await initCvQa(file, language);
        setQaSessionId(response.session_id);
        setQaCurrentQuestion(response.question);
        setQaHistory([{ role: "assistant", content: response.question }]);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setResult(await analyzeCv(file, language, plan));
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleSendAnswer(event) {
    if (event) event.preventDefault();
    if (!qaInput.trim() || loading) return;

    const userAnswer = qaInput.trim();
    setQaInput("");
    setLoading(true);
    setQaHistory((prev) => [...prev, { role: "user", content: userAnswer }]);

    try {
      const response = await answerCvQa(qaSessionId, userAnswer);
      if (response.is_complete) {
        setQaComplete(true);
        setQaCurrentQuestion(null);
        setQaProfile(response.profile);
        setQaHistory((prev) => [
          ...prev,
          { role: "assistant", content: t.qaFinished },
        ]);

        const matchResult = await matchFromProfile(
          response.profile,
          language,
          plan,
        );
        setQaJobs(matchResult.ranked_jobs);
      } else {
        setQaCurrentQuestion(response.question);
        setQaHistory((prev) => [
          ...prev,
          { role: "assistant", content: response.question },
        ]);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function changePlan(nextPlan) {
    setPlan(nextPlan);

    if (qaProfile) {
      setLoading(true);
      setMessage("");
      try {
        const matchResult = await matchFromProfile(
          qaProfile,
          language,
          nextPlan,
        );
        setQaJobs(matchResult.ranked_jobs);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!result || !file) return;
    setLoading(true);
    setMessage("");
    try {
      setResult(await analyzeCv(file, language, nextPlan));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancelQa() {
    setQaSessionId(null);
    setQaHistory([]);
    setQaCurrentQuestion(null);
    setQaInput("");
    setQaComplete(false);
    setQaProfile(null);
    setQaJobs([]);
    setResult(null);
    setFile(null);
  }

  return (
    <div
      className={`portal portal--candidate ${result || qaSessionId ? "has-result" : "no-result"}`}
    >
      <Header portal="candidate" />
      <main className="portal-main">
        <section className="portal-intro">
          <h1>{t.title}</h1>
          <p>{t.text}</p>
        </section>

        {!qaSessionId && (
          <form className="upload-panel" onSubmit={submit}>
            <div className="upload-plan-switch" role="group" aria-label="Plan">
              <button
                type="button"
                className={plan === "free" ? "is-active" : ""}
                onClick={() => changePlan("free")}
              >
                Free
              </button>
              <button
                type="button"
                className={plan === "pro" ? "is-active" : ""}
                onClick={() => changePlan("pro")}
              >
                PRO
              </button>
            </div>

            <div className="chat-mode-selector">
              <label>{t.selectMode}</label>
              <div className="chat-mode-options">
                <div
                  className={`chat-mode-option ${analysisMode === "interactive" ? "is-selected" : ""}`}
                  onClick={() => setAnalysisMode("interactive")}
                >
                  <strong>{t.modeInteractive}</strong>
                  <p>{t.modeInteractiveDesc}</p>
                </div>
                <div
                  className={`chat-mode-option ${analysisMode === "standard" ? "is-selected" : ""}`}
                  onClick={() => setAnalysisMode("standard")}
                >
                  <strong>{t.modeStandard}</strong>
                  <p>{t.modeStandardDesc}</p>
                </div>
              </div>
            </div>

            <label className="upload-zone">
              <svg
                className="upload-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  marginBottom: "12px",
                  color: "var(--purple)",
                  transition: "transform 0.25s ease",
                }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <strong>{file?.name || t.drop}</strong>
              <small>{t.formats}</small>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
            </label>
            <button className="button button--candidate" disabled={loading}>
              {loading
                ? t.loading
                : analysisMode === "interactive"
                  ? t.startChat
                  : t.button}
            </button>
            {message && <p className="form-message">{message}</p>}
          </form>
        )}

        {qaSessionId && (
          <section className="chat-panel">
            <div className="chat-header">
              <h3>💬 {t.interviewActive}</h3>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <button
                  type="button"
                  className="chat-cancel-btn"
                  onClick={handleCancelQa}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 12px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background 0.2s",
                  }}
                >
                  {t.cancel}
                </button>
                <div
                  className="upload-plan-switch"
                  role="group"
                  aria-label="Plan"
                  style={{
                    marginBottom: 0,
                    padding: "2px",
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  <button
                    type="button"
                    className={plan === "free" ? "is-active" : ""}
                    onClick={() => changePlan("free")}
                    style={{
                      padding: "4px 12px",
                      fontSize: "11px",
                      background: plan === "free" ? "#fff" : "transparent",
                      color: plan === "free" ? "var(--purple)" : "#fff",
                    }}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    className={plan === "pro" ? "is-active" : ""}
                    onClick={() => changePlan("pro")}
                    style={{
                      padding: "4px 12px",
                      fontSize: "11px",
                      background: plan === "pro" ? "#fff" : "transparent",
                      color: plan === "pro" ? "var(--purple)" : "#fff",
                    }}
                  >
                    PRO
                  </button>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {qaHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message chat-message--${msg.role}`}
                >
                  {msg.content}
                </div>
              ))}

              {loading && !qaComplete && (
                <div className="chat-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>

            {!qaComplete && (
              <form className="chat-input-area" onSubmit={handleSendAnswer}>
                <input
                  type="text"
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder={t.chatInputPlaceholder}
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={loading || !qaInput.trim()}
                >
                  {t.send}
                </button>
              </form>
            )}
          </section>
        )}

        {qaComplete && qaProfile && (
          <section className="extracted-profile-summary">
            <h4>🎯 {t.profileExtracted}</h4>
            <dl>
              {qaProfile.job_title_keywords && (
                <div>
                  <dt>{t.labelTitle}</dt>
                  <dd>{qaProfile.job_title_keywords.join(", ")}</dd>
                </div>
              )}
              {qaProfile.seniority_level && (
                <div>
                  <dt>{t.labelSeniority}</dt>
                  <dd>{qaProfile.seniority_level}</dd>
                </div>
              )}
              {qaProfile.location && (
                <div>
                  <dt>{t.labelLocation}</dt>
                  <dd>{qaProfile.location}</dd>
                </div>
              )}
              {qaProfile.job_function && (
                <div>
                  <dt>{t.labelFunction}</dt>
                  <dd>{qaProfile.job_function}</dd>
                </div>
              )}
              {qaProfile.industry && (
                <div>
                  <dt>{t.labelIndustry}</dt>
                  <dd>{qaProfile.industry}</dd>
                </div>
              )}
              {qaProfile.employment_type && (
                <div>
                  <dt>{t.labelType}</dt>
                  <dd>{qaProfile.employment_type}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {qaComplete && qaJobs && (
          <JobMatches jobs={qaJobs} language={language} plan={plan} />
        )}

        {result && (
          <>
            <section className="analysis-result">
              <div className="analysis-result__main">
                <span className="result-label">{t.summary}</span>
                <h2>{result.summary}</h2>
                <h3>{t.points}</h3>
                <ul>
                  {result.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <aside>
                {!!result.skills.length && (
                  <>
                    <h3>{t.skills}</h3>
                    <div className="tags">
                      {result.skills.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </>
                )}
                {!!result.languages.length && (
                  <>
                    <h3>{t.languages}</h3>
                    <div className="tags">
                      {result.languages.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </>
                )}
                <details>
                  <summary>{t.preview}</summary>
                  <pre>{result.preview}</pre>
                </details>
              </aside>
            </section>
            {result.checklist && (
              <ProfileChecklist
                checklist={result.checklist}
                language={language}
                plan={plan}
                onPlanChange={changePlan}
                onSaveAnswers={async (answers) => {
                  const updated = await completeProfile(
                    result.matching_profile,
                    answers,
                    language,
                    plan,
                  );
                  setResult((current) => ({
                    ...current,
                    ranked_jobs: updated.ranked_jobs,
                  }));
                }}
              />
            )}
            {plan === "pro" && result.cv_improvement && (
              <CvImprovementAudit
                audit={result.cv_improvement}
                language={language}
              />
            )}
            <JobMatches
              jobs={result.ranked_jobs}
              language={language}
              plan={plan}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
