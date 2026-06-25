import { useEffect, useState } from "react";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { TrainingPartnersCarousel } from "../components/TrainingPartnersCarousel";
import { useLanguage } from "../context/LanguageContext";

const JOBS_STORAGE_KEY = "talentmatch-jobs";
const COURSES_STORAGE_KEY = "talentmatch-courses";

const copy = {
  es: {
    eyebrow: "PORTAL EMPRESA",
    titleStart: "Publica",
    titleAccent: "oportunidades",
    titleEnd: "Descubre talento que encaja.",
    text: "Crea ofertas y formaciones que después conectaremos con el motor de matching.",
    dashboard: "Ofertas publicadas",
    dashboardText: "Aquí verás todas las ofertas de trabajo que has creado en este navegador.",
    emptyDashboard: "Aún no hay ofertas guardadas. Crea la primera y aparecerá aquí.",
    coursesDashboard: "Cursos y formaciones publicados",
    coursesDashboardText: "Aquí verás las formaciones que la empresa puede ofrecer como colaboración o plan de mejora.",
    emptyCoursesDashboard: "Aún no hay cursos guardados. Publica una formación y aparecerá aquí.",
    job: "Nueva oferta de trabajo",
    course: "Nuevo curso o formación",
    name: "Nombre",
    location: "Localización",
    skills: "Competencias",
    description: "Descripción",
    requirements: "Requisitos",
    saveJob: "Guardar oferta",
    saveCourse: "Guardar formación",
    saved: "Guardado en este navegador.",
    created: "Creada",
    published: "Publicado",
    candidates: "Candidatos compatibles",
    match: "match medio",
  },
  ca: {
    eyebrow: "PORTAL EMPRESA",
    titleStart: "Publica",
    titleAccent: "oportunitats",
    titleEnd: "Descobreix talent que encaixa.",
    text: "Crea ofertes i formacions que després connectarem amb el motor de matching.",
    dashboard: "Ofertes publicades",
    dashboardText: "Aquí veuràs totes les ofertes de feina que has creat en aquest navegador.",
    emptyDashboard: "Encara no hi ha ofertes desades. Crea la primera i apareixerà aquí.",
    coursesDashboard: "Cursos i formacions publicats",
    coursesDashboardText: "Aquí veuràs les formacions que l’empresa pot oferir com a col·laboració o pla de millora.",
    emptyCoursesDashboard: "Encara no hi ha cursos desats. Publica una formació i apareixerà aquí.",
    job: "Nova oferta de treball",
    course: "Nou curs o formació",
    name: "Nom",
    location: "Localització",
    skills: "Competències",
    description: "Descripció",
    requirements: "Requisits",
    saveJob: "Desar oferta",
    saveCourse: "Desar formació",
    saved: "Desat en aquest navegador.",
    created: "Creada",
    published: "Publicat",
    candidates: "Candidats compatibles",
    match: "match mitjà",
  },
  en: {
    eyebrow: "COMPANY PORTAL",
    titleStart: "Publish",
    titleAccent: "opportunities",
    titleEnd: "Discover talent that fits.",
    text: "Create jobs and training that will connect to the matching engine.",
    dashboard: "Published vacancies",
    dashboardText: "Here you will see every job vacancy created in this browser.",
    emptyDashboard: "No vacancies saved yet. Create the first one and it will appear here.",
    coursesDashboard: "Published courses and training",
    coursesDashboardText: "Here you will see training the company can offer as collaborations or improvement plans.",
    emptyCoursesDashboard: "No courses saved yet. Publish a training item and it will appear here.",
    job: "New job vacancy",
    course: "New course or training",
    name: "Name",
    location: "Location",
    skills: "Skills",
    description: "Description",
    requirements: "Requirements",
    saveJob: "Save vacancy",
    saveCourse: "Save training",
    saved: "Saved in this browser.",
    created: "Created",
    published: "Published",
    candidates: "Compatible candidates",
    match: "avg. match",
  },
};

function readStoredItems(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function createId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function CompanyForm({ type, t, language, onSave }) {
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...Object.fromEntries(new FormData(form).entries()),
    };

    onSave(type, data);
    form.reset();
    setMessage(t.saved);
  }

  const isJobsForm = type === "jobs";

  return (
    <form id={type} className="company-form" onSubmit={submit}>
      <h2>{isJobsForm ? t.job : t.course}</h2>
      <label>{t.name}<input name="title" required /></label>
      <label>{isJobsForm ? t.location : t.skills}<input name={isJobsForm ? "location" : "skills"} required /></label>
      <label>{t.description}<textarea name="description" rows="4" required /></label>
      <label>{t.requirements}<textarea name="requirements" rows="4" required /></label>
      <button className="button button--company">{isJobsForm ? t.saveJob : t.saveCourse}</button>
      {message && <p className="form-message form-message--success">{message}</p>}
      {!isJobsForm && <TrainingPartnersCarousel language={language} />}
    </form>
  );
}

function CompanyDashboard({ jobs, t }) {
  return (
    <section className="company-dashboard">
      <div className="company-dashboard__heading">
        <div>
          <span>{t.dashboard}</span>
          <h2>{t.dashboard}</h2>
          <p>{t.dashboardText}</p>
        </div>
        <strong>{jobs.length}</strong>
      </div>

      {jobs.length ? (
        <div className="company-dashboard__grid">
          {jobs.map((job, index) => (
            <article className="company-job-card" key={job.id || `${job.title}-${index}`}>
              <div className="company-job-card__top">
                <span>{t.created} · {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}</span>
                <strong>{Math.max(62, 91 - index * 5)}%</strong>
              </div>
              <h3>{job.title}</h3>
              <p className="company-job-card__location">{job.location}</p>
              <div className="company-job-card__meta">
                <div>
                  <small>{t.candidates}</small>
                  <strong>{Math.max(3, 18 - index * 2)}</strong>
                </div>
                <div>
                  <small>{t.match}</small>
                  <strong>{Math.max(62, 91 - index * 5)}%</strong>
                </div>
              </div>
              <details>
                <summary>{t.description}</summary>
                <p>{job.description}</p>
              </details>
              <details>
                <summary>{t.requirements}</summary>
                <p>{job.requirements || "—"}</p>
              </details>
            </article>
          ))}
        </div>
      ) : (
        <p className="company-dashboard__empty">{t.emptyDashboard}</p>
      )}
    </section>
  );
}

function CoursesDashboard({ courses, t }) {
  return (
    <section className="company-dashboard company-dashboard--courses">
      <div className="company-dashboard__heading">
        <div>
          <span>{t.coursesDashboard}</span>
          <h2>{t.coursesDashboard}</h2>
          <p>{t.coursesDashboardText}</p>
        </div>
        <strong>{courses.length}</strong>
      </div>

      {courses.length ? (
        <div className="company-dashboard__grid">
          {courses.map((course, index) => (
            <article className="company-job-card company-job-card--course" key={course.id || `${course.title}-${index}`}>
              <div className="company-job-card__top">
                <span>{t.published} · {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "—"}</span>
              </div>
              <h3>{course.title}</h3>
              <p className="company-job-card__location">{course.skills}</p>
              <details open>
                <summary>{t.description}</summary>
                <p>{course.description}</p>
              </details>
              <details>
                <summary>{t.requirements}</summary>
                <p>{course.requirements || "—"}</p>
              </details>
            </article>
          ))}
        </div>
      ) : (
        <p className="company-dashboard__empty">{t.emptyCoursesDashboard}</p>
      )}
    </section>
  );
}

export function CompanyPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setJobs(readStoredItems(JOBS_STORAGE_KEY));
    setCourses(readStoredItems(COURSES_STORAGE_KEY));
  }, []);

  function saveItem(type, data) {
    const key = type === "jobs" ? JOBS_STORAGE_KEY : COURSES_STORAGE_KEY;
    const updater = type === "jobs" ? setJobs : setCourses;

    updater((current) => {
      const next = [data, ...current].slice(0, 20);
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="portal portal--company">
      <Header portal="company" />
      <main className="portal-main">
        <BackButton language={language} />
        <section className="portal-intro">
          <span>{t.eyebrow}</span>
          <h1>
            {t.titleStart} <span className="portal-intro__accent">{t.titleAccent}</span>.{" "}
            {t.titleEnd}
          </h1>
          <p>{t.text}</p>
        </section>

        <section className="company-grid">
          <CompanyForm type="jobs" t={t} language={language} onSave={saveItem} />
          <CompanyForm type="courses" t={t} language={language} onSave={saveItem} />
        </section>

        <section className="company-dashboards-grid">
          <CompanyDashboard jobs={jobs} t={t} />
          <CoursesDashboard courses={courses} t={t} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
