import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AudienceCard } from "../components/AudienceCard";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  es: {
    titleStart: "El encuentro perfecto entre",
    talent: "Talento",
    titleMiddle: "y",
    opportunity: "Oportunidad",
    titleEnd: "potenciado por IA.",
    subtitle: "Optimizamos la búsqueda de empleo para candidatos y aceleramos la contratación para empresas. Sin sesgos, sin pérdida de tiempo, 100% basado en datos.",
    choose: "Elige cómo quieres usar TalentMatch AI",
    candidate: {
      label: "PARA PERSONAS", title: "Busco Empleo",
      pain: "¿Cansado de enviar CVs al vacío y no recibir respuesta?",
      benefits: ["Descubre tu % real de encaje antes de aplicar.", "Optimiza tu CV automáticamente para cada oferta.", "Recibe un plan personalizado para mejorar tu perfil."],
      cta: "Empezar Gratis", micro: "Únete a miles de candidatos que ya están consiguiendo entrevistas.",
    },
    company: {
      label: "PARA EMPRESAS", title: "Soy Empresa / Reclutador",
      pain: "¿Pierdes horas filtrando CVs que no encajan?",
      benefits: ["Recibe solo candidatos con >80% de compatibilidad real.", "Reduce el tiempo de contratación en un 70%.", "Accede a un ranking justificado por IA, no por palabras clave."],
      cta: "Ver Solución para RRHH", micro: "Prueba gratuita para equipos de contratación.",
    },
    trustTitle: "Tecnología transparente y ética.",
    trust: [["Privacidad Total", "Tus datos no se venden. Procesamiento seguro."], ["IA Explicable", "Te decimos el porqué de cada recomendación."], ["Sin Sesgos", "Algoritmos auditados para priorizar el mérito."]],
  },
  ca: {
    titleStart: "La trobada perfecta entre",
    talent: "Talent",
    titleMiddle: "i",
    opportunity: "Oportunitat",
    titleEnd: "potenciada per IA.",
    subtitle: "Optimitzem la cerca de feina per a candidats i accelerem la contractació per a empreses. Sense biaixos, sense perdre temps, 100% basat en dades.",
    choose: "Tria com vols utilitzar TalentMatch AI",
    candidate: { label:"PER A PERSONES",title:"Busco feina",pain:"Cansat d’enviar CVs al buit i no rebre resposta?",benefits:["Descobreix el teu % real d’encaix abans d’aplicar.","Optimitza el teu CV automàticament per a cada oferta.","Rep un pla personalitzat per millorar el teu perfil."],cta:"Començar gratis",micro:"Uneix-te a milers de candidats que ja estan aconseguint entrevistes." },
    company: { label:"PER A EMPRESES",title:"Soc empresa o reclutador",pain:"Perds hores filtrant CVs que no encaixen?",benefits:["Rep només candidats amb >80% de compatibilitat real.","Redueix el temps de contractació en un 70%.","Accedeix a un rànquing justificat per IA, no per paraules clau."],cta:"Veure solució per a RRHH",micro:"Prova gratuïta per a equips de contractació." },
    trustTitle:"Tecnologia transparent i ètica.",trust:[["Privacitat total","Les teves dades no es venen. Processament segur."],["IA explicable","T’expliquem el perquè de cada recomanació."],["Sense biaixos","Algoritmes auditats per prioritzar el mèrit."]],
  },
  en: {
    titleStart: "The perfect meeting between",
    talent: "Talent",
    titleMiddle: "and",
    opportunity: "Opportunity",
    titleEnd: "powered by AI.",
    subtitle: "We optimize job searches for candidates and accelerate hiring for companies. No bias, no wasted time, 100% data-driven.",
    choose: "Choose how you want to use TalentMatch AI",
    candidate: { label:"FOR PEOPLE",title:"I’m looking for work",pain:"Tired of sending résumés into a void and hearing nothing back?",benefits:["See your real match percentage before applying.","Automatically optimize your résumé for each job.","Get a personal plan to strengthen your profile."],cta:"Start Free",micro:"Join thousands of candidates already landing interviews." },
    company: { label:"FOR COMPANIES",title:"I’m a company or recruiter",pain:"Losing hours filtering résumés that do not fit?",benefits:["Receive only candidates with >80% real compatibility.","Reduce hiring time by 70%.","Access an AI-justified ranking, not a keyword filter."],cta:"See the HR Solution",micro:"Free trial for hiring teams." },
    trustTitle:"Transparent and ethical technology.",trust:[["Total privacy","Your data is never sold. Secure processing."],["Explainable AI","We explain the reason behind every recommendation."],["Without bias","Audited algorithms prioritize merit."]],
  },
};

export function HomePage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <Header language={language} />
      <main>
        <section className="hero">
          <div className="container hero__content">
            <h1>
              {t.titleStart}{" "}
              <span className="hero__accent">{t.talent}</span>{" "}
              {t.titleMiddle}{" "}
              <span className="hero__accent">{t.opportunity}</span>,{" "}
              {t.titleEnd}
            </h1>
            <p>{t.subtitle}</p>
          </div>
        </section>

        <section className="audiences">
          <div className="container">
            <h2>{t.choose}</h2>
            <div className="audiences__grid">
              <AudienceCard type="candidate" image="/images/cohete.jpeg" {...t.candidate} to="/candidate" />
              <AudienceCard type="company" image="/images/edificio.jpeg" {...t.company} to="/company" />
            </div>
          </div>
          <a
            className="audiences__credit"
            href="https://www.pexels.com/photo/people-holding-puzzle-pieces-6147365/"
            target="_blank"
            rel="noreferrer"
          >
            Photo: RDNE Stock project / Pexels
          </a>
        </section>

        <section className="trust" id="como-funciona">
          <div className="container">
            <h2>{t.trustTitle}</h2>
            <div className="trust__grid">
              {t.trust.map(([title, text], index) => (
                <article key={title}>
                  <span className="trust__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer language={language} />
    </>
  );
}
