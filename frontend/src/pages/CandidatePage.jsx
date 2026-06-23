import { useState } from "react";
import { BackButton } from "../components/BackButton";
import { CvImprovementAudit } from "../components/CvImprovementAudit";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { JobMatches } from "../components/JobMatches";
import { ProfileChecklist } from "../components/ProfileChecklist";
import { useLanguage } from "../context/LanguageContext";
import { analyzeCv, completeProfile } from "../services/api";

const copy = {
  es: { eyebrow:"PORTAL CANDIDATO",title:"Tu talento merece el match perfecto.",text:"Sube tu currículum y analizaremos tu experiencia, formación y competencias.",drop:"Selecciona o arrastra tu CV",formats:"PDF o DOCX · Máximo 10 MB",button:"Analizar mi CV",loading:"Leyendo el CV...",summary:"Esto es lo que hemos entendido",points:"Puntos clave",skills:"Competencias",languages:"Idiomas",preview:"Texto extraído",error:"Selecciona un PDF o DOCX válido." },
  ca: { eyebrow:"PORTAL CANDIDAT",title:"El teu talent mereix el match perfecte.",text:"Puja el teu currículum i analitzarem la teva experiència, formació i competències.",drop:"Selecciona o arrossega el teu CV",formats:"PDF o DOCX · Màxim 10 MB",button:"Analitzar el meu CV",loading:"Llegint el CV...",summary:"Això és el que hem entès",points:"Punts clau",skills:"Competències",languages:"Idiomes",preview:"Text extret",error:"Selecciona un PDF o DOCX vàlid." },
  en: { eyebrow:"CANDIDATE PORTAL",title:"Your talent deserves the perfect match.",text:"Upload your résumé and we will analyze your experience, education and skills.",drop:"Select or drag your résumé",formats:"PDF or DOCX · Maximum 10 MB",button:"Analyze my résumé",loading:"Reading résumé...",summary:"This is what we understood",points:"Key points",skills:"Skills",languages:"Languages",preview:"Extracted text",error:"Select a valid PDF or DOCX." },
};

export function CandidatePage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("free");

  async function submit(event) {
    event.preventDefault();
    if (!file || !/\.(pdf|docx)$/i.test(file.name)) {
      setMessage(t.error);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      setResult(await analyzeCv(file, language, plan));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function changePlan(nextPlan) {
    setPlan(nextPlan);
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

  return (
    <div className="portal portal--candidate">
      <Header portal="candidate" />
      <main className="portal-main">
        <BackButton language={language} />
        <section className="portal-intro">
          <span>{t.eyebrow}</span><h1>{t.title}</h1><p>{t.text}</p>
        </section>
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
          <label className="upload-zone">
            <strong>{file?.name || t.drop}</strong>
            <small>{t.formats}</small>
            <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0] || null)} />
          </label>
          <button className="button button--candidate" disabled={loading}>{loading ? t.loading : t.button}</button>
          {message && <p className="form-message">{message}</p>}
        </form>

        {result && (
          <>
            <section className="analysis-result">
              <div className="analysis-result__main">
                <span className="result-label">{t.summary}</span>
                <h2>{result.summary}</h2>
                <h3>{t.points}</h3>
                <ul>{result.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <aside>
                {!!result.skills.length && <><h3>{t.skills}</h3><div className="tags">{result.skills.map((item) => <span key={item}>{item}</span>)}</div></>}
                {!!result.languages.length && <><h3>{t.languages}</h3><div className="tags">{result.languages.map((item) => <span key={item}>{item}</span>)}</div></>}
                <details><summary>{t.preview}</summary><pre>{result.preview}</pre></details>
              </aside>
            </section>
            {result.checklist && (
              <ProfileChecklist
                checklist={result.checklist}
                language={language}
                plan={plan}
                onPlanChange={changePlan}
                onSaveAnswers={async (answers) => {
                  const updated = await completeProfile(result.matching_profile, answers);
                  setResult((current) => ({ ...current, ranked_jobs: updated.ranked_jobs }));
                }}
              />
            )}
            {plan === "pro" && result.cv_improvement && (
              <CvImprovementAudit audit={result.cv_improvement} language={language} />
            )}
            <JobMatches jobs={result.ranked_jobs} language={language} plan={plan} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
