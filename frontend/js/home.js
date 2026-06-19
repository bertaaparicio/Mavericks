/**
 * Traducció i preferència d'idioma de la homepage.
 * Aquesta pàgina no necessita accedir al backend: només orienta l'usuari.
 */

const copy = {
  ca: {
    navHow:"Com funciona",navPricing:"Preus",navBlog:"Blog",navLogin:"Login",companyAccess:"Accés empreses",
    imagePlaceholderTitle:"Espai reservat per a la imatge principal",imagePlaceholderText:"Aquí afegirem la il·lustració definitiva.",
    eyebrow:"MATCHING INTEL·LIGENT I EXPLICABLE",heroTitle:"La trobada perfecta entre talent i oportunitat, potenciada per IA.",
    heroText:"Optimitzem la cerca de feina per a candidats i accelerem la contractació per a empreses. Sense biaixos, sense perdre temps i basat en dades.",
    choosePath:"Tria el teu camí",freeStart:"Comença gratis · Sense targeta",chooseEyebrow:"UNA PLATAFORMA, DOS CAMINS",chooseTitle:"Què necessites avui?",
    candidateLabel:"PER A PERSONES",candidateTitle:"Busco feina",candidatePain:"Cansat d’enviar CVs al buit i no rebre resposta?",
    candidateBenefit1:"Descobreix el teu percentatge real d’encaix abans d’aplicar.",candidateBenefit2:"Optimitza el teu CV automàticament per a cada oferta.",candidateBenefit3:"Rep un pla personalitzat per millorar el teu perfil.",
    candidateCta:"Començar gratis",candidateMicro:"Uneix-te a candidats que ja estan aconseguint entrevistes.",
    companyLabel:"PER A EMPRESES",companyTitle:"Soc empresa o reclutador",companyPain:"Perds hores filtrant currículums que no encaixen?",
    companyBenefit1:"Rep només candidats amb alta compatibilitat real.",companyBenefit2:"Redueix el temps necessari per contractar.",companyBenefit3:"Accedeix a un rànquing justificat per IA.",
    companyCta:"Veure solució per a RRHH",companyMicro:"Prova gratuïta per a equips de contractació.",
    trustEyebrow:"CONFIANÇA PER DISSENY",trustTitle:"Tecnologia transparent i ètica.",privacyTitle:"Privacitat total",privacyText:"Les teves dades no es venen. Processament segur i controlat.",
    explainTitle:"IA explicable",explainText:"T’expliquem el perquè de cada recomanació i puntuació.",biasTitle:"Sense biaixos",biasText:"Prioritzem competències, experiència i mèrit professional.",
    footerClaim:"La tecnologia que fa que talent i oportunitats es trobin.",footerProduct:"Producte",footerLegal:"Legal i suport",privacyLink:"Privacitat",termsLink:"Termes",contactLink:"Contacte"
  },
  es: {
    navHow:"Cómo funciona",navPricing:"Precios",navBlog:"Blog",navLogin:"Login",companyAccess:"Acceso empresas",
    imagePlaceholderTitle:"Espacio reservado para la imagen principal",imagePlaceholderText:"Aquí añadiremos la ilustración definitiva.",
    eyebrow:"MATCHING INTELIGENTE Y EXPLICABLE",heroTitle:"El encuentro perfecto entre talento y oportunidad, potenciado por IA.",
    heroText:"Optimizamos la búsqueda de empleo para candidatos y aceleramos la contratación para empresas. Sin sesgos, sin pérdida de tiempo y basado en datos.",
    choosePath:"Elige tu camino",freeStart:"Empieza gratis · Sin tarjeta",chooseEyebrow:"UNA PLATAFORMA, DOS CAMINOS",chooseTitle:"¿Qué necesitas hoy?",
    candidateLabel:"PARA PERSONAS",candidateTitle:"Busco empleo",candidatePain:"¿Cansado de enviar CVs al vacío y no recibir respuesta?",
    candidateBenefit1:"Descubre tu porcentaje real de encaje antes de aplicar.",candidateBenefit2:"Optimiza tu CV automáticamente para cada oferta.",candidateBenefit3:"Recibe un plan personalizado para mejorar tu perfil.",
    candidateCta:"Empezar gratis",candidateMicro:"Únete a candidatos que ya están consiguiendo entrevistas.",
    companyLabel:"PARA EMPRESAS",companyTitle:"Soy empresa o reclutador",companyPain:"¿Pierdes horas filtrando currículums que no encajan?",
    companyBenefit1:"Recibe solo candidatos con alta compatibilidad real.",companyBenefit2:"Reduce el tiempo necesario para contratar.",companyBenefit3:"Accede a un ranking justificado por IA.",
    companyCta:"Ver solución para RRHH",companyMicro:"Prueba gratuita para equipos de contratación.",
    trustEyebrow:"CONFIANZA POR DISEÑO",trustTitle:"Tecnología transparente y ética.",privacyTitle:"Privacidad total",privacyText:"Tus datos no se venden. Procesamiento seguro y controlado.",
    explainTitle:"IA explicable",explainText:"Te contamos el porqué de cada recomendación y puntuación.",biasTitle:"Sin sesgos",biasText:"Priorizamos competencias, experiencia y mérito profesional.",
    footerClaim:"La tecnología que hace que talento y oportunidades se encuentren.",footerProduct:"Producto",footerLegal:"Legal y soporte",privacyLink:"Privacidad",termsLink:"Términos",contactLink:"Contacto"
  },
  en: {
    navHow:"How it works",navPricing:"Pricing",navBlog:"Blog",navLogin:"Login",companyAccess:"Company access",
    imagePlaceholderTitle:"Space reserved for the main image",imagePlaceholderText:"The final illustration will be added here.",
    eyebrow:"INTELLIGENT, EXPLAINABLE MATCHING",heroTitle:"The perfect meeting between talent and opportunity, powered by AI.",
    heroText:"We optimize job searches for candidates and accelerate hiring for companies. No bias, no wasted time, fully data-driven.",
    choosePath:"Choose your path",freeStart:"Start free · No card required",chooseEyebrow:"ONE PLATFORM, TWO PATHS",chooseTitle:"What do you need today?",
    candidateLabel:"FOR PEOPLE",candidateTitle:"I’m looking for work",candidatePain:"Tired of sending résumés into a void and hearing nothing back?",
    candidateBenefit1:"See your real match percentage before applying.",candidateBenefit2:"Automatically optimize your résumé for each job.",candidateBenefit3:"Get a personal plan to strengthen your profile.",
    candidateCta:"Start free",candidateMicro:"Join candidates who are already landing interviews.",
    companyLabel:"FOR COMPANIES",companyTitle:"I’m a company or recruiter",companyPain:"Losing hours filtering résumés that do not fit?",
    companyBenefit1:"Receive only candidates with strong real compatibility.",companyBenefit2:"Reduce the time required to hire.",companyBenefit3:"Access an AI-ranked and justified shortlist.",
    companyCta:"See the HR solution",companyMicro:"Free trial for hiring teams.",
    trustEyebrow:"TRUST BY DESIGN",trustTitle:"Transparent and ethical technology.",privacyTitle:"Total privacy",privacyText:"Your data is never sold. Secure, controlled processing.",
    explainTitle:"Explainable AI",explainText:"We explain the reasoning behind every recommendation and score.",biasTitle:"Bias aware",biasText:"We prioritize skills, experience and professional merit.",
    footerClaim:"Technology that helps talent and opportunity find each other.",footerProduct:"Product",footerLegal:"Legal and support",privacyLink:"Privacy",termsLink:"Terms",contactLink:"Contact"
  }
};

const selector = document.querySelector("#home-language");
let language = localStorage.getItem("talentmatch-language") || "ca";
if (!copy[language]) language = "ca";

function renderLanguage() {
  document.documentElement.lang = language;
  selector.value = language;
  document.querySelectorAll("[data-home-i18n]").forEach((element) => {
    const translated = copy[language][element.dataset.homeI18n];
    if (translated) element.textContent = translated;
  });
}

selector.addEventListener("change", () => {
  language = selector.value;
  localStorage.setItem("talentmatch-language", language);
  renderLanguage();
});

renderLanguage();
