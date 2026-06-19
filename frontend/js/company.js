/**
 * Portal empresa.
 *
 * En aquest MVP els formularis són interactius però no persisteixen dades.
 * Quan es creï l'API d'ofertes i cursos, només caldrà substituir
 * ``simulateSave`` per una petició ``fetch`` mantenint intacta la interfície.
 */

const copy = {
  ca: {
    navJobs:"Ofertes",navTraining:"Formació",navCandidates:"Candidats",switchProfile:"Canviar perfil",
    eyebrow:"CONTRACTACIÓ BASADA EN EVIDÈNCIES",heroTitle:"Publica oportunitats. Descobreix talent que encaixa de veritat.",
    heroText:"Centralitza les teves vacants, cursos i processos de selecció. TalentMatch AI compara competències i explica cada recomanació.",
    publishCta:"Publicar una oferta",courseCta:"Crear un curs",dashboardTitle:"Compatibilitat de candidats",
    workspaceEyebrow:"ESPAI DE TREBALL",workspaceTitle:"Què vols crear?",workspaceText:"Comença publicant una vacant o una formació. En fases següents connectarem aquests continguts amb el motor de matching.",
    jobTitle:"Nova oferta de treball",jobText:"Afegeix el rol, requisits imprescindibles, competències desitjables i condicions.",jobName:"Nom de la posició",jobLocation:"Localització",jobDescription:"Descripció i requisits",jobFile:"O adjunta una oferta en PDF o DOCX",saveJob:"Desar oferta",
    trainingTitle:"Nou curs o formació",trainingText:"Ofereix formació als candidats per cobrir les competències que el mercat necessita.",courseName:"Nom del curs",courseMode:"Modalitat",courseSkills:"Competències que desenvolupa",courseDescription:"Descripció",saveCourse:"Desar formació",
    jobSaved:"Oferta desada correctament en aquest navegador.",courseSaved:"Formació desada correctament en aquest navegador.",
    savedJobs:"Ofertes desades",savedCourses:"Formacions desades",emptyList:"Encara no n’has creat cap.",
    modeOnline:"Online",modeOnsite:"Presencial",modeHybrid:"Híbrid",footerClaim:"Matching explicable per a equips de contractació.",footerCompany:"Empresa",support:"Suport",privacy:"Privacitat",terms:"Termes"
  },
  es: {
    navJobs:"Ofertas",navTraining:"Formación",navCandidates:"Candidatos",switchProfile:"Cambiar perfil",
    eyebrow:"CONTRATACIÓN BASADA EN EVIDENCIAS",heroTitle:"Publica oportunidades. Descubre talento que encaja de verdad.",
    heroText:"Centraliza tus vacantes, cursos y procesos de selección. TalentMatch AI compara competencias y explica cada recomendación.",
    publishCta:"Publicar una oferta",courseCta:"Crear un curso",dashboardTitle:"Compatibilidad de candidatos",
    workspaceEyebrow:"ESPACIO DE TRABAJO",workspaceTitle:"¿Qué quieres crear?",workspaceText:"Empieza publicando una vacante o una formación. En las siguientes fases conectaremos estos contenidos con el motor de matching.",
    jobTitle:"Nueva oferta de trabajo",jobText:"Añade el rol, requisitos imprescindibles, competencias deseables y condiciones.",jobName:"Nombre del puesto",jobLocation:"Localización",jobDescription:"Descripción y requisitos",jobFile:"O adjunta una oferta en PDF o DOCX",saveJob:"Guardar oferta",
    trainingTitle:"Nuevo curso o formación",trainingText:"Ofrece formación para cubrir las competencias que necesita el mercado.",courseName:"Nombre del curso",courseMode:"Modalidad",courseSkills:"Competencias que desarrolla",courseDescription:"Descripción",saveCourse:"Guardar formación",
    jobSaved:"Oferta guardada correctamente en este navegador.",courseSaved:"Formación guardada correctamente en este navegador.",
    savedJobs:"Ofertas guardadas",savedCourses:"Formaciones guardadas",emptyList:"Todavía no has creado ninguna.",
    modeOnline:"Online",modeOnsite:"Presencial",modeHybrid:"Híbrido",footerClaim:"Matching explicable para equipos de contratación.",footerCompany:"Empresa",support:"Soporte",privacy:"Privacidad",terms:"Términos"
  },
  en: {
    navJobs:"Jobs",navTraining:"Training",navCandidates:"Candidates",switchProfile:"Switch profile",
    eyebrow:"EVIDENCE-BASED HIRING",heroTitle:"Publish opportunities. Discover talent that genuinely fits.",
    heroText:"Centralize vacancies, courses and hiring processes. TalentMatch AI compares skills and explains every recommendation.",
    publishCta:"Publish a job",courseCta:"Create a course",dashboardTitle:"Candidate compatibility",
    workspaceEyebrow:"WORKSPACE",workspaceTitle:"What would you like to create?",workspaceText:"Start by publishing a vacancy or training course. Future phases will connect this content to the matching engine.",
    jobTitle:"New job vacancy",jobText:"Add the role, must-have requirements, desirable skills and conditions.",jobName:"Position name",jobLocation:"Location",jobDescription:"Description and requirements",jobFile:"Or attach a PDF or DOCX vacancy",saveJob:"Save vacancy",
    trainingTitle:"New course or training",trainingText:"Offer training that helps candidates develop the skills the market needs.",courseName:"Course name",courseMode:"Format",courseSkills:"Skills developed",courseDescription:"Description",saveCourse:"Save training",
    jobSaved:"Vacancy saved successfully in this browser.",courseSaved:"Training saved successfully in this browser.",
    savedJobs:"Saved vacancies",savedCourses:"Saved training",emptyList:"You have not created any yet.",
    modeOnline:"Online",modeOnsite:"On-site",modeHybrid:"Hybrid",footerClaim:"Explainable matching for hiring teams.",footerCompany:"Company",support:"Support",privacy:"Privacy",terms:"Terms"
  }
};

const selector = document.querySelector("#company-language");
const jobForm = document.querySelector("#job-form");
const courseForm = document.querySelector("#course-form");
const savedJobs = document.querySelector("#saved-jobs");
const savedCourses = document.querySelector("#saved-courses");
let language = localStorage.getItem("talentmatch-language") || "ca";
if (!copy[language]) language = "ca";

function renderLanguage() {
  document.documentElement.lang = language;
  selector.value = language;
  document.querySelectorAll("[data-company-i18n]").forEach((element) => {
    const value = copy[language][element.dataset.companyI18n];
    if (value) element.textContent = value;
  });
  renderSavedContent();
}

/**
 * Guarda un formulari com a JSON a localStorage.
 * Aquesta persistència és suficient per al prototip i es podrà substituir
 * posteriorment per endpoints autenticats sense alterar els formularis.
 */
function enableLocalSave(form, messageId, translationKey, storageKey) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const item = Object.fromEntries(formData.entries());
    const currentItems = JSON.parse(localStorage.getItem(storageKey) || "[]");
    currentItems.unshift({ ...item, createdAt: new Date().toISOString() });
    localStorage.setItem(storageKey, JSON.stringify(currentItems.slice(0, 10)));
    document.querySelector(messageId).textContent = copy[language][translationKey];
    form.reset();
    renderSavedContent();
  });
}

function renderList(container, items, detailField) {
  container.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "saved-empty";
    empty.textContent = copy[language].emptyList;
    container.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "saved-item";
    const info = document.createElement("div");
    const title = document.createElement("strong");
    const detail = document.createElement("small");
    title.textContent = item.title;
    detail.textContent = item[detailField] || "";
    info.append(title, detail);
    row.appendChild(info);
    container.appendChild(row);
  });
}

function renderSavedContent() {
  const jobs = JSON.parse(localStorage.getItem("talentmatch-company-jobs") || "[]");
  const courses = JSON.parse(localStorage.getItem("talentmatch-company-courses") || "[]");
  renderList(savedJobs, jobs, "location");
  renderList(savedCourses, courses, "skills");
}

selector.addEventListener("change", () => {
  language = selector.value;
  localStorage.setItem("talentmatch-language", language);
  renderLanguage();
});

enableLocalSave(jobForm, "#job-message", "jobSaved", "talentmatch-company-jobs");
enableLocalSave(courseForm, "#course-message", "courseSaved", "talentmatch-company-courses");
renderLanguage();
