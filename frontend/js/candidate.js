/**
 * Portal candidat.
 *
 * Aquest mòdul controla exclusivament:
 * - Traduccions de la pàgina de candidat.
 * - Selecció i validació local del CV.
 * - Enviament del document a l'API.
 * - Renderització del resum retornat pel backend.
 */

const translations = {
  ca: {
    pageTitle: "TalentMatch | Troba la teva oportunitat",
    pageDescription: "TalentMatch analitza el teu currículum i t’ajuda a trobar les oportunitats laborals que encaixen millor amb tu.",
    brandHome: "TalentMatch, pàgina d’inici", trustLabel: "Característiques del servei",
    navLabel: "Navegació principal", languageLabel: "Idioma",
    navHow: "Com funciona", navBenefits: "Avantatges", navStart: "Comença ara",
    heroEyebrow: "El teu pròxim pas comença aquí",
    heroTitle: "El teu talent mereix el", heroAccent: "match perfecte.",
    heroText: "Analitzem el teu currículum, coneixem què busques i et connectem amb les oportunitats laborals que millor encaixen amb tu.",
    trustFast: "Ràpid i senzill", trustPrivate: "Dades protegides",
    trustPersonal: "Recomanacions personalitzades",
    stepOne: "PAS 1 DE 3", uploadTitle: "Puja el teu currículum",
    uploadIntro: "L’analitzarem per identificar la teva experiència, formació i habilitats.",
    dropTitle: "Arrossega el teu CV aquí", dropSubtitle: "o fes clic per seleccionar-lo",
    dropFormats: "Formats acceptats: PDF o DOCX · Màxim 10 MB",
    removeFile: "Eliminar l’arxiu", analyzeButton: "Analitza el meu CV",
    privacy: "El teu CV és privat i no es comparteix amb tercers.",
    analyzedEyebrow: "CV ANALITZAT", analyzedTitle: "Això és el que hem entès del teu perfil",
    anotherCv: "Analitza un altre CV", keyPoints: "Punts clau detectats",
    nextStep: "Pròxim pas",
    chatDescription: "Aquí apareixerà el chatbot per completar el perfil amb preguntes sobre objectius, preferències i disponibilitat.",
    chatPlaceholder: "El xat s’activarà a la següent fase...", send: "Enviar",
    processedDocument: "Document processat", skills: "Competències", languages: "Idiomes",
    showPreview: "Veure una mostra del text llegit",
    easyEyebrow: "AIXÍ DE FÀCIL", processTitle: "Del teu CV a la teva pròxima oportunitat",
    processOneTitle: "Comparteix el teu CV",
    processOneText: "Puja’l en PDF o DOCX. Nosaltres ens encarreguem d’entendre’l.",
    processTwoTitle: "Completa el teu perfil",
    processTwoText: "Et farem unes preguntes breus per conèixer objectius i preferències.",
    processThreeTitle: "Descobreix els teus matches",
    processThreeText: "Rep ofertes ordenades segons la compatibilitat real amb el teu perfil.",
    footerText: "Troba l’oportunitat que encaixa amb tu.",
    invalidFormat: "Selecciona un document en format PDF o DOCX.",
    tooLarge: "El document supera el límit de 10 MB.",
    selectFirst: "Primer has de seleccionar el teu currículum.",
    analyzing: "Llegint i analitzant el CV...",
    analysisError: "No s’ha pogut analitzar el document.",
    success: "CV llegit correctament.",
    connectionError: "No podem connectar amb el servidor. Obre la web des de http://localhost:8000.",
    words: "paraules", page: "pàgina", pages: "pàgines", textBlocks: "blocs de text",
  },
  es: {
    pageTitle: "TalentMatch | Encuentra tu oportunidad",
    pageDescription: "TalentMatch analiza tu currículum y te ayuda a encontrar las oportunidades laborales que mejor encajan contigo.",
    brandHome: "TalentMatch, página de inicio", trustLabel: "Características del servicio",
    navLabel: "Navegación principal", languageLabel: "Idioma",
    navHow: "Cómo funciona", navBenefits: "Ventajas", navStart: "Empieza ahora",
    heroEyebrow: "Tu próximo paso empieza aquí",
    heroTitle: "Tu talento merece el", heroAccent: "match perfecto.",
    heroText: "Analizamos tu currículum, conocemos lo que buscas y te conectamos con las oportunidades laborales que mejor encajan contigo.",
    trustFast: "Rápido y sencillo", trustPrivate: "Datos protegidos",
    trustPersonal: "Recomendaciones personalizadas",
    stepOne: "PASO 1 DE 3", uploadTitle: "Sube tu currículum",
    uploadIntro: "Lo analizaremos para identificar tu experiencia, formación y habilidades.",
    dropTitle: "Arrastra tu CV aquí", dropSubtitle: "o haz clic para seleccionarlo",
    dropFormats: "Formatos aceptados: PDF o DOCX · Máximo 10 MB",
    removeFile: "Eliminar el archivo", analyzeButton: "Analiza mi CV",
    privacy: "Tu CV es privado y no se comparte con terceros.",
    analyzedEyebrow: "CV ANALIZADO", analyzedTitle: "Esto es lo que hemos entendido de tu perfil",
    anotherCv: "Analiza otro CV", keyPoints: "Puntos clave detectados",
    nextStep: "Siguiente paso",
    chatDescription: "Aquí aparecerá el chatbot para completar el perfil con preguntas sobre objetivos, preferencias y disponibilidad.",
    chatPlaceholder: "El chat se activará en la siguiente fase...", send: "Enviar",
    processedDocument: "Documento procesado", skills: "Competencias", languages: "Idiomas",
    showPreview: "Ver una muestra del texto leído",
    easyEyebrow: "ASÍ DE FÁCIL", processTitle: "De tu CV a tu próxima oportunidad",
    processOneTitle: "Comparte tu CV",
    processOneText: "Súbelo en PDF o DOCX. Nosotros nos encargamos de entenderlo.",
    processTwoTitle: "Completa tu perfil",
    processTwoText: "Te haremos unas preguntas breves para conocer tus objetivos y preferencias.",
    processThreeTitle: "Descubre tus matches",
    processThreeText: "Recibe ofertas ordenadas según la compatibilidad real con tu perfil.",
    footerText: "Encuentra la oportunidad que encaja contigo.",
    invalidFormat: "Selecciona un documento en formato PDF o DOCX.",
    tooLarge: "El documento supera el límite de 10 MB.",
    selectFirst: "Primero debes seleccionar tu currículum.",
    analyzing: "Leyendo y analizando el CV...",
    analysisError: "No se ha podido analizar el documento.",
    success: "CV leído correctamente.",
    connectionError: "No podemos conectar con el servidor. Abre la web desde http://localhost:8000.",
    words: "palabras", page: "página", pages: "páginas", textBlocks: "bloques de texto",
  },
  en: {
    pageTitle: "TalentMatch | Find your opportunity",
    pageDescription: "TalentMatch analyzes your résumé and helps you find the job opportunities that best match your profile.",
    brandHome: "TalentMatch, home page", trustLabel: "Service features",
    navLabel: "Main navigation", languageLabel: "Language",
    navHow: "How it works", navBenefits: "Benefits", navStart: "Get started",
    heroEyebrow: "Your next step starts here",
    heroTitle: "Your talent deserves the", heroAccent: "perfect match.",
    heroText: "We analyze your résumé, understand what you are looking for and connect you with the job opportunities that suit you best.",
    trustFast: "Quick and simple", trustPrivate: "Protected data",
    trustPersonal: "Personalized recommendations",
    stepOne: "STEP 1 OF 3", uploadTitle: "Upload your résumé",
    uploadIntro: "We will analyze it to identify your experience, education and skills.",
    dropTitle: "Drag your résumé here", dropSubtitle: "or click to select it",
    dropFormats: "Accepted formats: PDF or DOCX · Maximum 10 MB",
    removeFile: "Remove file", analyzeButton: "Analyze my résumé",
    privacy: "Your résumé is private and is not shared with third parties.",
    analyzedEyebrow: "RÉSUMÉ ANALYZED", analyzedTitle: "This is what we understood about your profile",
    anotherCv: "Analyze another résumé", keyPoints: "Key points detected",
    nextStep: "Next step",
    chatDescription: "The chatbot will appear here to complete your profile with questions about goals, preferences and availability.",
    chatPlaceholder: "The chat will be activated in the next phase...", send: "Send",
    processedDocument: "Processed document", skills: "Skills", languages: "Languages",
    showPreview: "Show a sample of the extracted text",
    easyEyebrow: "THAT SIMPLE", processTitle: "From your résumé to your next opportunity",
    processOneTitle: "Share your résumé",
    processOneText: "Upload it as a PDF or DOCX. We will take care of understanding it.",
    processTwoTitle: "Complete your profile",
    processTwoText: "We will ask a few short questions to understand your goals and preferences.",
    processThreeTitle: "Discover your matches",
    processThreeText: "Receive jobs ranked by their real compatibility with your profile.",
    footerText: "Find the opportunity that fits you.",
    invalidFormat: "Select a PDF or DOCX document.",
    tooLarge: "The document exceeds the 10 MB limit.",
    selectFirst: "You must select your résumé first.",
    analyzing: "Reading and analyzing the résumé...",
    analysisError: "The document could not be analyzed.",
    success: "Résumé read successfully.",
    connectionError: "We cannot connect to the server. Open the website from http://localhost:8000.",
    words: "words", page: "page", pages: "pages", textBlocks: "text blocks",
  },
};

const fileInput = document.querySelector("#cv-file");
const dropZone = document.querySelector("#drop-zone");
const selectedFile = document.querySelector("#file-selected");
const fileName = document.querySelector("#file-name");
const fileSize = document.querySelector("#file-size");
const removeFileButton = document.querySelector("#remove-file");
const form = document.querySelector("#cv-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");
const languageSelector = document.querySelector("#language-selector");
const analysisSection = document.querySelector("#resultat");
const analysisSummary = document.querySelector("#analysis-summary");
const analysisHighlights = document.querySelector("#analysis-highlights");
const resultFilename = document.querySelector("#result-filename");
const documentStats = document.querySelector("#document-stats");
const skillsList = document.querySelector("#skills-list");
const languagesList = document.querySelector("#languages-list");
const skillsGroup = document.querySelector("#skills-group");
const languagesGroup = document.querySelector("#languages-group");
const textPreview = document.querySelector("#text-preview");
const analyzeAnotherButton = document.querySelector("#analyze-another");

const maxFileSize = 10 * 1024 * 1024;
const allowedExtensions = ["pdf", "docx"];
let currentLanguage = localStorage.getItem("talentmatch-language") || "ca";
if (!translations[currentLanguage]) currentLanguage = "ca";

function t(key) {
  return translations[currentLanguage][key] || key;
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = t("pageTitle");
  document.querySelector("#meta-description").setAttribute("content", t("pageDescription"));
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  languageSelector.value = currentLanguage;
}

function formatFileSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) return t("invalidFormat");
  if (file.size > maxFileSize) return t("tooLarge");
  return "";
}

function showFile(file) {
  const error = validateFile(file);
  if (error) {
    clearFile();
    message.textContent = error;
    return;
  }
  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);
  selectedFile.hidden = false;
  dropZone.hidden = true;
  message.textContent = "";
}

function clearFile() {
  fileInput.value = "";
  selectedFile.hidden = true;
  dropZone.hidden = false;
  fileName.textContent = "";
  fileSize.textContent = "";
  message.textContent = "";
  message.classList.remove("success");
}

function createTags(container, values) {
  container.replaceChildren();
  values.forEach((value) => {
    const tag = document.createElement("span");
    tag.textContent = value;
    container.appendChild(tag);
  });
}

function showAnalysis(result) {
  analysisSummary.textContent = result.summary;
  resultFilename.textContent = result.filename;
  textPreview.textContent = result.preview;
  analysisHighlights.replaceChildren();
  result.highlights.forEach((highlight) => {
    const item = document.createElement("li");
    item.textContent = highlight;
    analysisHighlights.appendChild(item);
  });
  createTags(skillsList, result.skills);
  createTags(languagesList, result.languages);
  skillsGroup.hidden = result.skills.length === 0;
  languagesGroup.hidden = result.languages.length === 0;

  const stats = [
    `${result.metadata.words} ${t("words")}`,
    result.metadata.pages
      ? `${result.metadata.pages} ${result.metadata.pages === 1 ? t("page") : t("pages")}`
      : `${result.metadata.paragraphs} ${t("textBlocks")}`,
    result.metadata.format,
  ];
  documentStats.replaceChildren();
  stats.forEach((stat) => {
    const element = document.createElement("span");
    element.textContent = stat;
    documentStats.appendChild(element);
  });
  analysisSection.hidden = false;
}

async function analyzeCurrentFile(scrollToResult = true) {
  if (!fileInput.files.length) {
    message.textContent = t("selectFirst");
    return;
  }
  const error = validateFile(fileInput.files[0]);
  if (error) {
    message.textContent = error;
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = t("analyzing");
  message.textContent = "";
  message.classList.remove("success");
  const formData = new FormData();
  formData.append("cv", fileInput.files[0]);
  formData.append("language", currentLanguage);

  try {
    const response = await fetch("/api/analyze", { method: "POST", body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || t("analysisError"));
    message.textContent = t("success");
    message.classList.add("success");
    showAnalysis(result);
    if (scrollToResult) {
      analysisSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    message.textContent = error instanceof TypeError ? t("connectionError") : error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = `<span data-i18n="analyzeButton">${t("analyzeButton")}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>`;
  }
}

languageSelector.addEventListener("change", async () => {
  currentLanguage = languageSelector.value;
  localStorage.setItem("talentmatch-language", currentLanguage);
  applyTranslations();
  if (!analysisSection.hidden && fileInput.files.length) {
    await analyzeCurrentFile(false);
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) showFile(fileInput.files[0]);
});

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  const droppedFile = event.dataTransfer.files[0];
  if (!droppedFile) return;
  const transfer = new DataTransfer();
  transfer.items.add(droppedFile);
  fileInput.files = transfer.files;
  showFile(droppedFile);
});

removeFileButton.addEventListener("click", clearFile);
analyzeAnotherButton.addEventListener("click", () => {
  analysisSection.hidden = true;
  clearFile();
  document.querySelector("#pujar-cv").scrollIntoView({ behavior: "smooth" });
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await analyzeCurrentFile();
});

applyTranslations();
