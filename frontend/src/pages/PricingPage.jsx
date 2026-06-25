import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  es: {
    eyebrow: "PLANES PARA CANDIDATOS",
    title: "Elige el impulso que necesita tu búsqueda de empleo.",
    subtitle:
      "Empieza gratis para conocer tu encaje o activa PRO para analizar, adaptar y mejorar cada candidatura sin límites.",
    recommended: "MÁS ELEGIDO",
    free: {
      name: "Free",
      description: "Ideal para explorar el mercado sin coste.",
      price: "0 €",
      period: "para siempre",
      cta: "Empezar gratis",
      features: [
        "Hasta 5 análisis de ofertas por semana.",
        "Score general de compatibilidad.",
        "Resumen de las habilidades que te faltan.",
        "Perfil básico de experiencia y formación.",
      ],
      note: "Sin tarjeta de crédito.",
    },
    pro: {
      name: "PRO",
      description: "Para quien busca empleo activamente y quiere resultados más rápidos.",
      monthly: "Mensual",
      annual: "Anual",
      save: "· Ahorra 40%",
      priceMonthly: "9,99 €",
      priceAnnual: "5,99 €",
      periodMonthly: "al mes",
      periodAnnual: "al mes, facturado anualmente",
      noteMonthly: "Sin compromiso · Cancela cuando quieras.",
      noteAnnual: "Facturado anualmente.",
      cta: "Elegir plan PRO",
      features: [
        "Análisis ilimitados y score detallado.",
        "Desglose de requisitos Must Have y Nice to Have.",
        "CVs y cartas adaptados a cada oferta.",
        "Roadmap personalizado de cursos y certificaciones.",
        "Simulador de entrevistas con IA.",
      ],
      note: "Cancela cuando quieras.",
    },
    compareTitle: "La diferencia está en el nivel de acompañamiento.",
    compareText:
      "Free te ayuda a descubrir oportunidades. PRO te acompaña durante todo el proceso: desde entender el encaje hasta preparar la entrevista.",
    ethicsTitle: "Un modelo que trabaja para ti, no con tus datos.",
    ethicsText:
      "TalentMatch AI no vende tu información. Los pagos, cursos recomendados y ofertas destacadas nunca modifican tu score ni el ranking por mérito.",
    privacy: "Privacidad total",
    privacyText: "Tus documentos y datos profesionales no se comercializan.",
    merit: "Mérito primero",
    meritText: "Pagar nunca mejora artificialmente una candidatura.",
    clarity: "Precios claros",
    clarityText: "Sin costes ocultos ni permanencia.",
  },
  ca: {
    eyebrow: "PLANS PER A CANDIDATS",
    title: "Tria l’impuls que necessita la teva cerca de feina.",
    subtitle:
      "Comença gratis per conèixer el teu encaix o activa PRO per analitzar, adaptar i millorar cada candidatura sense límits.",
    recommended: "MÉS TRIAT",
    free: {
      name: "Free",
      description: "Ideal per explorar el mercat sense cost.",
      price: "0 €",
      period: "per sempre",
      cta: "Començar gratis",
      features: [
        "Fins a 5 anàlisis d’ofertes per setmana.",
        "Score general de compatibilitat.",
        "Resum de les habilitats que et falten.",
        "Perfil bàsic d’experiència i formació.",
      ],
      note: "Sense targeta de crèdit.",
    },
    pro: {
      name: "PRO",
      description: "Per a qui busca feina activament i vol resultats més ràpids.",
      monthly: "Mensual",
      annual: "Anual",
      save: "· Estalvia 40%",
      priceMonthly: "9,99 €",
      priceAnnual: "5,99 €",
      periodMonthly: "al mes",
      periodAnnual: "al mes, facturat anualment",
      noteMonthly: "Sense compromís · Cancel·la quan vulguis.",
      noteAnnual: "Facturat anualment.",
      cta: "Triar el pla PRO",
      features: [
        "Anàlisis il·limitades i score detallat.",
        "Desglossament de requisits Must Have i Nice to Have.",
        "CVs i cartes adaptats a cada oferta.",
        "Roadmap personalitzat de cursos i certificacions.",
        "Simulador d’entrevistes amb IA.",
      ],
      note: "Cancel·la quan vulguis.",
    },
    compareTitle: "La diferència és el nivell d’acompanyament.",
    compareText:
      "Free t’ajuda a descobrir oportunitats. PRO t’acompanya durant tot el procés: des d’entendre l’encaix fins a preparar l’entrevista.",
    ethicsTitle: "Un model que treballa per a tu, no amb les teves dades.",
    ethicsText:
      "TalentMatch AI no ven la teva informació. Els pagaments, cursos recomanats i ofertes destacades mai modifiquen el teu score ni el rànquing per mèrit.",
    privacy: "Privacitat total",
    privacyText: "Els teus documents i dades professionals no es comercialitzen.",
    merit: "Mèrit primer",
    meritText: "Pagar mai millora artificialment una candidatura.",
    clarity: "Preus clars",
    clarityText: "Sense costos ocults ni permanència.",
  },
  en: {
    eyebrow: "PLANS FOR CANDIDATES",
    title: "Choose the boost your job search needs.",
    subtitle:
      "Start free to understand your fit, or activate PRO to analyze, adapt and improve every application without limits.",
    recommended: "MOST POPULAR",
    free: {
      name: "Free",
      description: "Ideal for exploring the market at no cost.",
      price: "€0",
      period: "forever",
      cta: "Start free",
      features: [
        "Up to 5 job analyses per week.",
        "General compatibility score.",
        "Summary of missing skills.",
        "Basic experience and education profile.",
      ],
      note: "No credit card required.",
    },
    pro: {
      name: "PRO",
      description: "For active job seekers who want faster results.",
      monthly: "Monthly",
      annual: "Annual",
      save: "· Save 40%",
      priceMonthly: "€9.99",
      priceAnnual: "€5.99",
      periodMonthly: "per month",
      periodAnnual: "per month, billed annually",
      noteMonthly: "No commitment · Cancel at any time.",
      noteAnnual: "Billed annually.",
      cta: "Choose PRO",
      features: [
        "Unlimited analyses and detailed scores.",
        "Must Have and Nice to Have breakdown.",
        "Résumés and cover letters tailored to each job.",
        "Personal roadmap of courses and certifications.",
        "AI interview simulator.",
      ],
      note: "Cancel at any time.",
    },
    compareTitle: "The difference is the level of support.",
    compareText:
      "Free helps you discover opportunities. PRO supports the full process, from understanding your fit to preparing for the interview.",
    ethicsTitle: "A model that works for you, not with your data.",
    ethicsText:
      "TalentMatch AI never sells your information. Payments, recommended courses and featured jobs never alter your score or merit ranking.",
    privacy: "Total privacy",
    privacyText: "Your documents and professional data are never sold.",
    merit: "Merit first",
    meritText: "Payment never artificially improves an application.",
    clarity: "Clear pricing",
    clarityText: "No hidden fees or lock-in.",
  },
};

function PricingCard({ plan, featured, billing, onToggle, labels }) {
  const isAnnual = billing === "annual";
  const price = featured
    ? isAnnual ? plan.priceAnnual : plan.priceMonthly
    : plan.price;
  const period = featured
    ? isAnnual ? plan.periodAnnual : plan.periodMonthly
    : plan.period;
  const note = featured
    ? isAnnual ? plan.noteAnnual : plan.noteMonthly
    : plan.note;
  const navigate = useNavigate();

  return (
    <article className={`pricing-card ${featured ? "pricing-card--featured" : ""}`}>

      <div className="pricing-card__heading">
        <div className="pricing-card__title-row">
          <h2>{plan.name}</h2>
          
          {featured && (
            <div className="pricing-card__toggle">
              <button
                className={`pricing-toggle__btn ${!isAnnual ? "is-active" : ""}`}
                onClick={() => onToggle("monthly")}
              >
                {labels.monthly}
              </button>
              <button
                className={`pricing-toggle__btn ${isAnnual ? "is-active" : ""}`}
                onClick={() => onToggle("annual")}
              >
                {labels.annual} <span className="pricing-toggle__save">{labels.save}</span>
              </button>
            </div>
          )}
        </div>

        <p>{plan.description}</p>
      </div>

      <div className="pricing-card__price">
        <strong>{price}</strong>
        <span>{period}</span>
      </div>

      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      {featured ? (
        <button
          className="button button--candidate"
          onClick={handleProClick}
        >
          {plan.cta}
        </button>
      ) : (
        <Link className="button button--outline" to="/candidate">
          {plan.cta}
        </Link>
      )}

      <small>{note}</small>
    </article>
  );
}

export function PricingPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [billing, setBilling] = useState("annual");

  return (
    <div className="pricing-page">
      <Header portal="pricing" />
      <main className="pricing-main">
        <BackButton language={language} />
        <section className="pricing-hero">
          <span>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>
        <section className="pricing-grid" aria-label={t.eyebrow}>
          <PricingCard plan={t.free} />
          <PricingCard
            plan={t.pro}
            featured
            billing={billing}
            onToggle={setBilling}
            labels={{ monthly: t.pro.monthly, annual: t.pro.annual, save: t.pro.save }}
          />
        </section>
        <section className="pricing-explanation">
          <h2>{t.compareTitle}</h2>
          <p>{t.compareText}</p>
        </section>
        <section className="pricing-ethics">
          <div className="pricing-ethics__intro">
            <span>TalentMatch AI</span>
            <h2>{t.ethicsTitle}</h2>
            <p>{t.ethicsText}</p>
          </div>
          <div className="pricing-ethics__points">
            <article><strong>01</strong><h3>{t.privacy}</h3><p>{t.privacyText}</p></article>
            <article><strong>02</strong><h3>{t.merit}</h3><p>{t.meritText}</p></article>
            <article><strong>03</strong><h3>{t.clarity}</h3><p>{t.clarityText}</p></article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function handleProClick() {
  localStorage.setItem("talentmatch-plan", "pro");
  navigate("/candidate");
}