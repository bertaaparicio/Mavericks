import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import { BackButton } from "../components/BackButton";

const copy = {
  es:{eyebrow:"PORTAL EMPRESA",title:"Publica oportunidades. Descubre talento que encaja.",text:"Crea ofertas y formaciones que después conectaremos con el motor de matching.",job:"Nueva oferta de trabajo",course:"Nuevo curso o formación",name:"Nombre",location:"Localización",description:"Descripción y requisitos",skills:"Competencias",saveJob:"Guardar oferta",saveCourse:"Guardar formación",saved:"Guardado en este navegador."},
  ca:{eyebrow:"PORTAL EMPRESA",title:"Publica oportunitats. Descobreix talent que encaixa.",text:"Crea ofertes i formacions que després connectarem amb el motor de matching.",job:"Nova oferta de treball",course:"Nou curs o formació",name:"Nom",location:"Localització",description:"Descripció i requisits",skills:"Competències",saveJob:"Desar oferta",saveCourse:"Desar formació",saved:"Desat en aquest navegador."},
  en:{eyebrow:"COMPANY PORTAL",title:"Publish opportunities. Discover talent that fits.",text:"Create jobs and training that will connect to the matching engine.",job:"New job vacancy",course:"New course or training",name:"Name",location:"Location",description:"Description and requirements",skills:"Skills",saveJob:"Save vacancy",saveCourse:"Save training",saved:"Saved in this browser."},
};

function CompanyForm({ type, t }) {
  const [message, setMessage] = useState("");
  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const key = `talentmatch-${type}`;
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([data, ...current].slice(0, 10)));
    event.currentTarget.reset();
    setMessage(t.saved);
  }
  return (
    <form className="company-form" onSubmit={submit}>
      <h2>{type === "jobs" ? t.job : t.course}</h2>
      <label>{t.name}<input name="title" required /></label>
      <label>{type === "jobs" ? t.location : t.skills}<input name={type === "jobs" ? "location" : "skills"} required /></label>
      <label>{t.description}<textarea name="description" rows="5" required /></label>
      <button className="button button--company">{type === "jobs" ? t.saveJob : t.saveCourse}</button>
      <p className="form-message form-message--success">{message}</p>
    </form>
  );
}

export function CompanyPage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <div className="portal portal--company">
      <Header language={language} portal="company" />
      <main className="portal-main">
        <BackButton language={language} />
        <section className="portal-intro">
          <span>{t.eyebrow}</span><h1>{t.title}</h1><p>{t.text}</p>
        </section>
        <section className="company-grid">
          <CompanyForm type="jobs" t={t} />
          <CompanyForm type="courses" t={t} />
        </section>
      </main>
      <Footer language={language} />
    </div>
  );
}
