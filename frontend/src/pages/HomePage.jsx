import { Link } from "react-router-dom";
import { AudienceCard } from "../components/AudienceCard";
import { Background } from "../components/Background";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";

const Coursera = (props) => (
  <svg
    {...props}
    viewBox="0 0 1155 164"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
  >
    <path
      d="M160 82c0-45 36-81 82-81s83 36 83 81c0 44-37 80-83 80s-82-36-82-80zm125 0a43 43 0 0 0-86 0 43 43 0 0 0 86 0zm706 1c0-49 40-82 76-82 24 0 38 8 48 22l3-19h37v155h-37l-4-16c-11 12-25 19-47 19-36 0-76-31-76-79zm126 0c0-24-20-43-43-43-24 0-43 19-43 43 0 21 19 41 42 41 24 0 44-20 44-41zM946 22V4h-40v155h40V76c0-26 12-39 34-39l4 1 7-38c-21 0-36 7-45 22zm-404 0V4h-41l1 155h40V76c0-26 12-39 34-39l4 1 7-38c-21 0-36 7-45 22zM339 99V4h40v90c0 20 11 32 31 32 21 0 34-13 34-38V4h40v155h-40v-18c-10 15-25 22-47 22-36 0-58-26-58-64zm392-17c0-44 31-81 80-81 46 0 78 37 78 80l-1 13H770c4 18 20 32 43 32 14 0 29-5 38-17l28 22a80 80 0 0 1-66 31c-47 0-82-35-82-80zm118-16c-3-16-19-28-38-28s-34 11-40 27l78 1zm-262 60 36-19c6 13 18 20 35 20 15 0 21-5 21-12 0-25-85-10-85-67 0-31 28-48 62-48 26 0 49 12 61 33l-35 19c-5-11-15-17-28-17-12 0-18 5-18 12 0 24 85 9 85 67 0 30-25 48-64 48-34 0-58-11-70-36zM0 82C0 37 37 1 82 1c28 0 55 13 70 37l-34 20a43 43 0 0 0-36-19c-23 0-42 20-42 43 0 22 19 42 42 42a43 43 0 0 0 37-20l34 20A83 83 0 0 1 0 82z"
      fill="#0056D2"
      fillRule="nonzero"
    />
  </svg>
);

const Udemy = (props) => (
  <svg {...props} viewBox="0 0 91 34" fill="none">
    <path
      d="M14.05 8.11L7.02 4.06 0 8.1V4.06L7.03 0l7.02 4.06V8.1z"
      fill="#A435F0"
    />
    <path
      d="M0 11.52h3.68v8.94a3.27 3.27 0 003.35 3.44 3.3 3.3 0 003.34-3.47v-8.91h3.68v9.15c0 2.13-.67 3.77-2 4.9a7.55 7.55 0 01-5.06 1.67 7.4 7.4 0 01-5.01-1.67C.67 24.44 0 22.87 0 20.77v-9.25zm45.87 11.11a5.57 5.57 0 01-3.83 1.48c-2.64 0-4.41-1.5-4.61-3.83h11.89s.08-.76.08-1.46c0-2.2-.7-4.02-2.13-5.5a7.13 7.13 0 00-5.45-2.23 7.9 7.9 0 00-5.78 2.22 7.93 7.93 0 00-2.25 5.87v.12c0 2.4.76 4.32 2.25 5.75a8.17 8.17 0 005.87 2.16c2.8 0 5.02-1.1 6.69-3l-2.73-1.58zm-7-7.46a4.7 4.7 0 012.95-.98c1.07 0 1.95.34 2.7 1a3 3 0 011.16 2.23h-8.16c.12-.9.57-1.64 1.35-2.25zm44.04 14.1C81.41 32.8 79.86 34 77.46 34H75.8v-3.26h1.34c.83 0 1.6-.31 2.32-2l.73-1.68-6.3-15.54h3.75L82.1 22.7l4.6-11.2h3.73L82.9 29.27zM28.38 5.66v7.26a7.58 7.58 0 00-4.9-1.73c-2.16 0-3.98.76-5.47 2.31a7.87 7.87 0 00-2.2 5.69 8 8 0 002.2 5.72 7.37 7.37 0 005.47 2.28c2.5 0 4.06-.98 4.9-1.75v1.42h3.65V5.65h-3.65zm-1.1 16.88c-.88.88-2 1.34-3.31 1.34a4.4 4.4 0 01-3.26-1.34c-.85-.89-1.27-2.01-1.27-3.35 0-1.34.42-2.46 1.27-3.34.88-.89 1.95-1.34 3.26-1.34s2.43.45 3.31 1.34c.91.88 1.37 2 1.37 3.34 0 1.34-.46 2.47-1.37 3.35zM68.22 11.2a6.39 6.39 0 00-5.2 2.26c-.4-.75-1.5-2.26-4.1-2.26a5.17 5.17 0 00-4.14 1.9v-1.59h-3.62v15.33h3.62v-8.82c0-2.07 1.28-3.56 2.98-3.56 1.74 0 2.74 1.3 2.74 3.4v8.98h3.62v-8.82c0-2.1 1.24-3.56 3.04-3.56 1.73 0 2.73 1.3 2.73 3.4v8.97h3.65v-9.48c0-4-2.14-6.15-5.32-6.15z"
      fill="#000"
    />
  </svg>
);

const EdX = (props) => (
  <svg
    {...props}
    viewBox="0 0 552.88 310.72"
    style={{ enableBackground: "new 0 0 552.88 310.72" }}
  >
    <polygon
      className="st0"
      points="353.43,50.96 364.08,0 51.3,0 0,245.01 261.52,245.01 247.12,310.72 497.63,310.72 552.88,50.96 "
    />
    <path
      className="st1"
      d="M106.6,213.73c-7.09,0-13.79-1.16-20.09-3.49c-6.3-2.32-11.8-5.75-16.49-10.28  c-4.69-4.53-8.39-10.1-11.11-16.72c-2.72-6.62-4.08-14.22-4.08-22.81c0-11.74,1.63-22.44,4.9-32.09  c3.27-9.65,7.82-17.92,13.65-24.82c5.83-6.89,12.82-12.23,20.98-16.01c8.15-3.78,17.08-5.67,26.77-5.67  c6.54,0,12.74,1.14,18.62,3.43c5.87,2.29,11.01,5.61,15.42,9.99c4.41,4.37,7.92,9.75,10.52,16.13c2.6,6.38,3.9,13.71,3.9,21.98  c0,1.26-0.04,2.74-0.12,4.43c-0.08,1.7-0.2,3.43-0.36,5.2c-0.16,1.77-0.32,3.51-0.47,5.2c-0.16,1.69-0.35,3.13-0.59,4.31H76.22  c-0.08,1.11-0.14,2.17-0.18,3.19c-0.04,1.03-0.06,2.09-0.06,3.19c0,6.54,0.95,12.11,2.84,16.72c1.89,4.61,4.35,8.37,7.39,11.29  c3.03,2.92,6.44,5.02,10.22,6.32c3.78,1.3,7.6,1.95,11.46,1.95c8.43,0,15.21-1.46,20.33-4.37c5.12-2.91,9.02-6.85,11.7-11.82h21.63  c-1.34,4.89-3.55,9.46-6.62,13.71c-3.07,4.25-6.95,7.94-11.64,11.05c-4.69,3.11-10.13,5.56-16.31,7.33  C120.8,212.84,114,213.73,106.6,213.73z M148.08,136.08c0.08-0.39,0.14-1.12,0.18-2.19c0.04-1.06,0.06-2.11,0.06-3.13  c0-4.18-0.61-8.14-1.83-11.88c-1.22-3.74-3.05-7.03-5.5-9.87c-2.44-2.84-5.48-5.08-9.1-6.74c-3.63-1.65-7.84-2.48-12.65-2.48  c-4.89,0-9.46,0.87-13.71,2.6c-4.26,1.73-8.12,4.2-11.58,7.39c-3.47,3.19-6.46,7.01-8.98,11.46c-2.52,4.45-4.53,9.4-6.03,14.83  H148.08z"
    />
    <path
      className="st1"
      d="M227.58,213.73c-6.38,0-12.37-1.2-17.97-3.61c-5.6-2.4-10.5-5.85-14.71-10.34c-4.22-4.49-7.55-9.93-9.99-16.31  c-2.44-6.38-3.66-13.51-3.66-21.39c0-7.64,0.77-14.95,2.3-21.92s3.72-13.43,6.56-19.38c2.84-5.95,6.24-11.33,10.22-16.13  c3.98-4.81,8.39-8.9,13.24-12.29c4.85-3.39,10.08-5.99,15.72-7.8c5.63-1.81,11.52-2.72,17.67-2.72c4.57,0,8.92,0.63,13.06,1.89  c4.14,1.26,7.88,3.01,11.23,5.26c3.35,2.25,6.22,4.96,8.63,8.15c2.4,3.19,4.16,6.68,5.26,10.46h1.89l15.72-74.11h20.68l-37.82,178  h-19.62l3.66-17.37h-1.89c-4.65,6.07-10.48,10.85-17.49,14.36C243.26,211.97,235.69,213.73,227.58,213.73z M234.08,195.41  c6.62,0,12.74-1.55,18.38-4.67c5.63-3.11,10.54-7.37,14.71-12.76c4.18-5.4,7.45-11.74,9.81-19.03c2.36-7.29,3.55-15.15,3.55-23.58  c0-5.44-0.75-10.32-2.25-14.66c-1.5-4.33-3.63-8.02-6.38-11.05c-2.76-3.03-6.11-5.38-10.05-7.03c-3.94-1.66-8.39-2.48-13.36-2.48  c-6.54,0-12.61,1.46-18.2,4.37c-5.6,2.92-10.44,6.97-14.54,12.17c-4.1,5.2-7.33,11.41-9.69,18.61s-3.55,15.11-3.55,23.7  c0,5.36,0.77,10.28,2.31,14.77c1.54,4.49,3.68,8.33,6.44,11.52c2.76,3.19,6.07,5.67,9.93,7.45  C225.05,194.52,229.35,195.41,227.58,213.73z"
    />
    <polygon
      className="st1"
      points="508.94,84.45 462.81,84.45 412.49,146.75 410.01,146.75 383.4,84.45 336.74,84.45 376.74,174.94 290.39,277.23 335.9,277.23 391.32,211.52 395.06,211.52 425,277.23 470.79,277.23 426.51,179.47 "
    />
  </svg>
);

const LinkedIn = (props) => (
  <svg {...props} preserveAspectRatio="xMidYMid" viewBox="0 0 256 256">
    <path
      d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
      fill="#0A66C2"
    />
  </svg>
);

const PartnerLogo5 = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.819748 40.528873"
  >
    <defs>
      <clipPath id="a">
        <path fill="white" d="M0 0h309.23999v153.17999H0z" />
      </clipPath>
    </defs>
    <g fill="none" clipPath="url(#a)" transform="scale(.26458)">
      <path
        fill="#000"
        d="M89.8299 81.83l-16.41-23.46v23.46h-16.98V27.84h16.98v22.83l16.86-22.68H110.39L89.7199 53.46 110.71 81.83z"
      />
      <path
        fill="#00ff84"
        d="M299.29 152.84c5.495 0 9.95-4.405 9.95-9.84 0-5.434-4.455-9.84-9.95-9.84-5.495 0-9.95 4.406-9.95 9.84 0 5.435-4.455 9.84 9.95 9.84zM126.05 19.68c5.495 0 9.95-4.4055 9.95-9.84 0-5.43448-4.455-9.84-9.95-9.84-5.495 0-9.95 4.40552-9.95 9.84 0 5.4345 4.455 9.84 9.95 9.84z"
      />
      <path
        fill="#000"
        d="M134.54 27.84h-16.98v53.99h16.98zM117.24 124.8c0-16.09 9.94-28.3699 25.58-28.3699 7.82 0 13.96 3.6899 16.87 9.1599v-7.7099h16.98V151.72h-16.98v-7.6c-2.91 5.36-9.61 9.05-17.09 9.05-16.08.01-25.36-12.17-25.36-28.37zm43.12 0c0-7.71-4.36-14.08-12.85-14.08-7.93 0-12.85 5.92-12.85 14.08 0 8.15 4.91 14.19 12.85 14.19 8.5 0 12.85-6.37 12.85-14.19zM186.67 97.88h17.09v11.28c1.9-8.04 8.27-12.17 14.86-12.17 2.01 0 3.13.11 4.47.45l-.09 15.85c-2.01-.23-2.93-.33-5.05-.33-9.27 0-14.19 6.03-14.19 17.98v20.78h-17.09zM226.55 124.8c0-17.65 11.51-28.3699 29.04-28.3699 16.76 0 28.15 10.3899 28.15 25.5799 0 2.79-.11 4.47-.45 7.48h-39.77c.33 7.04 5.03 10.84 12.62 10.84 5.25 0 8.6-1.45 10.05-4.8h16.76c-1.67 10.61-12.51 17.65-26.81 17.65-18.31 0-29.59-10.39-29.59-28.38zm40.33-5.92c-.11-7.15-4.13-10.95-11.39-10.95-7.37 0-11.84 4.36-11.95 10.95zM161.5 65.8V27.84h-17.09V81.83h41.47V65.8zM212.23 65.8V27.84h-17.09V81.83h41.47V65.8zM93.6699 97.86v19.39h-20.48V97.86h-16.75v54h16.75v-19.13h20.48v19.13H110.43v-54zM35.36 119.75l-10.44-2.89c-3.53-1.05-4.75-2.6-4.75-4.79 0-2.39 1.88-3.8 4.31-4.08 3.53-.41 6.26 1.12 6.26 4.93v.25H48.7v-.25h-.01c0-10.75-9.09-16.68-24.27-16.68-13.84 0-22.99 6.72-22.99 16.91 0 8.17 4.91 13.66 13.5 15.78l10.77 2.7c3.2 1.01 4.49 2.58 4.48 5.04-.01 2.69-2.71 4.21-5.47 4.34-4 .18-6.91-1.99-7.13-5.44H0c.26 10.3 10.34 17.54 25.43 17.54 14.28 0 23.55-6.6 23.55-17.8-.01-8.17-5.14-13.32-13.62-15.56zM35.36 49.86l-10.44-2.89c-3.53-1.05-4.75-2.6-4.75-4.79 0-2.39 1.88-3.8 4.31-4.08 3.53-.41 6.26 1.12 6.26 4.93v.25H48.7v-.25h-.01c0-10.75-9.09-16.68-24.27-16.68-13.84 0-22.99 6.72-22.99 16.91 0 8.17 4.91 13.66 13.5 15.78l10.77 2.7c3.2 1.01 4.49 2.58 4.48 5.04-.01 2.69-2.71 4.21-5.47 4.34-4 .18-6.91-1.99-7.13-5.44H0c.26 10.3 10.34 17.54 25.43 17.54 14.28 0 23.55-6.6 23.55-17.8-.01-8.17-5.14-13.32-13.62-15.56z"
      />
    </g>
  </svg>
);

const translations = {
  es: {
    titleStart: "El encuentro perfecto entre",
    talent: "Talento",
    titleMiddle: "y",
    opportunity: "Oportunidad",
    titleEnd: "potenciado por IA.",
    subtitle:
      "Optimizamos la búsqueda de empleo para candidatos y aceleramos la contratación para empresas. Sin sesgos, sin pérdida de tiempo, 100% basado en datos.",
    choose: "Elige cómo quieres usar TalentMatch AI",
    candidate: {
      label: "PARA PERSONAS",
      title: "Encuentra tu próximo empleo",
      pain: "¿Cansado de enviar CVs al vacío y no recibir respuesta?",
      benefits: [
        "Descubre tu % real de encaje antes de aplicar.",
        "Optimiza tu CV automáticamente para cada oferta.",
        "Recibe un plan personalizado para mejorar tu perfil.",
      ],
      cta: "Empezar Gratis",
      micro:
        "Únete a miles de candidatos que ya están consiguiendo entrevistas.",
    },
    company: {
      label: "PARA EMPRESAS",
      title: "Encuentra tu próxima contratación",
      pain: "¿Pierdes horas filtrando CVs que no encajan?",
      benefits: [
        "Recibe solo candidatos con >80% de compatibilidad real.",
        "Reduce el tiempo de contratación en un 70%.",
        "Accede a un ranking justificado por IA, no por palabras clave.",
      ],
      cta: "Solución para RRHH",
      micro: "Prueba gratuita para equipos de contratación.",
    },
    whyUsTitle: "Por qué nos eligen",
    candidateBenefits: {
      eyebrow: "¿TIENES TALENTO?",
      title: "Por qué les encanta a los candidatos",
      points: [
        "Conecta directamente con responsables de contratación de las mejores empresas — sin intermediarios ni reclutadores externos.",
        "Todo lo que necesitas saber, por adelantado. Consulta salario, opciones de acciones y más antes de postularte.",
        "Dile adiós a las cartas de presentación — tu perfil es todo lo que necesitas. Un clic para postularte y listo.",
        "Empleos únicos en empresas líderes y compañías tecnológicas que no encontrarás en ningún otro lugar.",
      ],
      ctaLearn: "Saber más",
      ctaSignup: "Registrarse",
    },
    companyBenefits: {
      eyebrow: "¿BUSCAS TALENTO?",
      title: "Por qué les encanta a las empresas",
      points: [
        "Accede a una comunidad masiva de candidatos altamente cualificados y listos para trabajar.",
        "Todo lo que necesitas para empezar a contratar — publica ofertas, destaca tu marca de empresa y usa herramientas de RRHH en 10 minutos, gratis.",
        "Un sistema de seguimiento de candidatos (ATS) gratuito o integración sencilla con el que ya utilices.",
        "Deja que nosotros hagamos el trabajo duro. Nuestro nuevo asistente de IA escanea candidatos destacados, filtra según tus necesidades y agenda entrevistas automáticamente.",
      ],
      ctaLearn: "Saber más",
      ctaSignup: "Registrarse",
    },
    howTitle: "¿Cómo funciona TalentMatch AI?",
    howCandidate: {
      label: "PARA PERSONAS",
      steps: [
        [
          "01",
          "Sube tu CV",
          "Carga tu currículum en PDF o DOCX. Nuestra IA extrae automáticamente tus habilidades, experiencia y formación.",
        ],
        [
          "02",
          "Compara con ofertas",
          "Pega o selecciona una oferta de trabajo. El sistema cruza tu perfil con los requisitos y calcula tu % de encaje real.",
        ],
        [
          "03",
          "Mejora tu perfil",
          "Recibe un informe detallado con las skills que te faltan y recursos concretos para conseguirlas.",
        ],
      ],
    },
    howCompany: {
      label: "PARA EMPRESAS",
      steps: [
        [
          "01",
          "Publica tu oferta",
          "Define el puesto con sus requisitos Must Have y Nice to Have. El sistema lo procesa automáticamente.",
        ],
        [
          "02",
          "Ranking automático",
          "Recibe un ranking de candidatos ordenado por compatibilidad real, con explicación de cada puntuación.",
        ],
        [
          "03",
          "Contrata más rápido",
          "Reduce el tiempo de selección hasta un 70% enfocándote solo en los candidatos que realmente encajan.",
        ],
      ],
    },
    trustTitle: "Tecnología transparente y ética.",
    trust: [
      ["Privacidad Total", "Tus datos no se venden. Procesamiento seguro."],
      ["IA Explicable", "Te decimos el porqué de cada recomendación."],
      ["Sin Sesgos", "Algoritmos auditados para priorizar el mérito."],
    ],
  },
  ca: {
    titleStart: "La trobada perfecta entre",
    talent: "Talent",
    titleMiddle: "i",
    opportunity: "Oportunitat",
    titleEnd: "potenciada per IA.",
    subtitle:
      "Optimitzem la cerca de feina per a candidats i accelerem la contractació per a empreses. Sense biaixos, sense perdre temps, 100% basat en dades.",
    choose: "Tria com vols utilitzar TalentMatch AI",
    candidate: {
      label: "PER A PERSONES",
      title: "Troba la teva propera feina",
      pain: "Cansat d’enviar CVs al buit i no rebre resposta?",
      benefits: [
        "Descobreix el teu % real d’encaix abans d’aplicar.",
        "Optimitza el teu CV automàticament per a cada oferta.",
        "Rep un pla personalitzat per millorar el teu perfil.",
      ],
      cta: "Començar gratis",
      micro:
        "Uneix-te a milers de candidats que ja estan aconseguint entrevistes.",
    },
    company: {
      label: "PER A EMPRESES",
      title: "Troba la teva propera contractació",
      pain: "Perds hores filtrant CVs que no encaixen?",
      benefits: [
        "Rep només candidats amb >80% de compatibilitat real.",
        "Redueix el temps de contractació en un 70%.",
        "Accedeix a un rànquing justificat per IA, no per paraules clau.",
      ],
      cta: "Veure solució per a RRHH",
      micro: "Prova gratuïta per a equips de contractació.",
    },
    whyUsTitle: "Per què ens trien",
    candidateBenefits: {
      eyebrow: "TENS TALENT?",
      title: "Per què els encanta als candidats",
      points: [
        "Connecta directament amb responsables de contractació de les millors empreses — sense intermediaris ni reclutadors externs.",
        "Tot el que necessites saber, per endavant. Consulta salari, opcions d'accions i més abans d'aplicar.",
        "Diu adéu a les cartes de presentació — el teu perfil és tot el que necessites. Un clic per aplicar i llist.",
        "Feines úniques a empreses líders i companyies tecnològiques que no trobaràs en cap altre lloc.",
      ],
      ctaLearn: "Saber-ne més",
      ctaSignup: "Registrar-se",
    },
    companyBenefits: {
      eyebrow: "BUSQUES TALENT?",
      title: "Per què els encanta a les empreses",
      points: [
        "Accedeix a una comunitat massiva de candidats altament qualificats i preparats per treballar.",
        "Tot el que necessites per començar a contractar — publica ofertes, destaca la marca d'empresa i utilitza eines de RRHH en 10 minuts, de franc.",
        "Un sistema de seguiment de candidats (ATS) gratuït o integració senzilla amb el que ja utilitzis.",
        "Deixa que nosaltres fem la feina dura. El nostre nou assistent d'IA escaneja candidats destacats, filtra segons les teves necessitats i programa entrevistes automàticament.",
      ],
      ctaLearn: "Saber-ne més",
      ctaSignup: "Registrar-se",
    },
    howTitle: "Com funciona TalentMatch AI?",
    howCandidate: {
      label: "PER A PERSONES",
      steps: [
        [
          "01",
          "Puja el teu CV",
          "Carrega el teu currículum en PDF o DOCX. La nostra IA extrau automàticament les teves habilitats, experiència i formació.",
        ],
        [
          "02",
          "Compara amb ofertes",
          "Enganxa o selecciona una oferta de feina. El sistema creua el teu perfil amb els requisits i calcula el teu % d'encaix real.",
        ],
        [
          "03",
          "Millora el teu perfil",
          "Rep un informe detallat amb les skills que et falten i recursos concrets per aconseguir-les.",
        ],
      ],
    },
    howCompany: {
      label: "PER A EMPRESES",
      steps: [
        [
          "01",
          "Publica la teva oferta",
          "Defineix el lloc amb els seus requisits Must Have i Nice to Have. El sistema ho processa automàticament.",
        ],
        [
          "02",
          "Rànquing automàtic",
          "Rep un rànquing de candidats ordenat per compatibilitat real, amb l'explicació de cada puntuació.",
        ],
        [
          "03",
          "Contracta més ràpid",
          "Redueix el temps de selecció fins a un 70% centrant-te només en els candidats que realment encaixen.",
        ],
      ],
    },
    trustTitle: "Tecnologia transparent i ètica.",
    trust: [
      ["Privacitat total", "Les teves dades no es venen. Processament segur."],
      ["IA explicable", "T’expliquem el perquè de cada recomanació."],
      ["Sense biaixos", "Algoritmes auditats per prioritzar el mèrit."],
    ],
  },
  en: {
    titleStart: "The perfect meeting between",
    talent: "Talent",
    titleMiddle: "and",
    opportunity: "Opportunity",
    titleEnd: "powered by AI.",
    subtitle:
      "We optimize job searches for candidates and accelerate hiring for companies. No bias, no wasted time, 100% data-driven.",
    choose: "Choose how you want to use TalentMatch AI",
    candidate: {
      label: "FOR PEOPLE",
      title: "Find your next job",
      pain: "Tired of sending résumés into a void and hearing nothing back?",
      benefits: [
        "See your real match percentage before applying.",
        "Automatically optimize your résumé for each job.",
        "Get a personal plan to strengthen your profile.",
      ],
      cta: "Start Free",
      micro: "Join thousands of candidates already landing interviews.",
    },
    company: {
      label: "FOR COMPANIES",
      title: "Find your next hire",
      pain: "Losing hours filtering résumés that do not fit?",
      benefits: [
        "Receive only candidates with >80% real compatibility.",
        "Reduce hiring time by 70%.",
        "Access an AI-justified ranking, not a keyword filter.",
      ],
      cta: "See the HR Solution",
      micro: "Free trial for hiring teams.",
    },
    whyUsTitle: "Why they love us",
    candidateBenefits: {
      eyebrow: "GOT TALENT?",
      title: "Why job seekers love us",
      points: [
        "Connect directly with hiring managers at top companies — no third party recruiters allowed.",
        "Everything you need to know, all upfront. View salary, stock options, and more before applying.",
        "Say goodbye to cover letters — your profile is all you need. One click to apply and you're done.",
        "Unique jobs at leading businesses and tech companies you can’t find anywhere else.",
      ],
      ctaLearn: "Learn more",
      ctaSignup: "Sign up",
    },
    companyBenefits: {
      eyebrow: "NEED TALENT?",
      title: "Why recruiters love us",
      points: [
        "Tap into a massive community of highly qualified, job-ready candidates.",
        "Everything you need to kickstart your recruiting — set up job posts, company branding, and HR tools within 10 minutes, all for free.",
        "A free applicant tracking system, or free integration with any ATS you may already use.",
        "Let us handle the heavy-lifting. Our new AI assistant scans top candidates, filters them down based on your unique calibration, and schedules your favorites on your calendar.",
      ],
      ctaLearn: "Learn more",
      ctaSignup: "Sign up",
    },
    howTitle: "How does TalentMatch AI work?",
    howCandidate: {
      label: "FOR INDIVIDUALS",
      steps: [
        [
          "01",
          "Upload your CV",
          "Upload your resume in PDF or DOCX. Our AI automatically extracts your skills, experience, and education.",
        ],
        [
          "02",
          "Compare with job offers",
          "Paste or select a job offer. The system cross-references your profile with the requirements and calculates your real match %.",
        ],
        [
          "03",
          "Improve your profile",
          "Receive a detailed report with the skills you're missing and concrete resources to acquire them.",
        ],
      ],
    },
    howCompany: {
      label: "FOR COMPANIES",
      steps: [
        [
          "01",
          "Post your job offer",
          "Define the position with its Must Have and Nice to Have requirements. The system processes it automatically.",
        ],
        [
          "02",
          "Automatic ranking",
          "Receive a ranked list of candidates sorted by real compatibility, with an explanation for each score.",
        ],
        [
          "03",
          "Hire faster",
          "Reduce screening time by up to 70% by focusing only on candidates who truly fit.",
        ],
      ],
    },
    trustTitle: "Transparent and ethical technology.",
    trust: [
      ["Total privacy", "Your data is never sold. Secure processing."],
      ["Explainable AI", "We explain the reason behind every recommendation."],
      ["Without bias", "Audited algorithms prioritize merit."],
    ],
  },
};

export function HomePage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <Background />
          <div className="container hero__content">
            <h1>
              {t.titleStart} <span className="hero__accent">{t.talent}</span>{" "}
              {t.titleMiddle}{" "}
              <span className="hero__accent">{t.opportunity}</span>,{" "}
              {t.titleEnd}
            </h1>

            <p className="hero__subtitle">{t.subtitle}</p>

            <div className="hero__partners">
              <span className="hero__partners-label">Partners</span>
              <div className="hero__partners-logos">
                <div className="hero__partner-logo-wrapper">
                  <Coursera className="hero__partner-logo" />
                </div>
                <div className="hero__partner-logo-wrapper">
                  <Udemy className="hero__partner-logo" />
                </div>
                <div className="hero__partner-logo-wrapper">
                  <EdX className="hero__partner-logo" />
                </div>
                <div className="hero__partner-logo-wrapper">
                  <LinkedIn className="hero__partner-logo" />
                </div>
                <div className="hero__partner-logo-wrapper">
                  <PartnerLogo5 className="hero__partner-logo" />
                </div>
              </div>
            </div>

            <div className="hero__audiences">
              <div className="audiences__grid">
                <AudienceCard
                  type="candidate"
                  image="/images/cohete.jpeg"
                  {...t.candidate}
                  to="/candidate"
                />
                <AudienceCard
                  type="company"
                  image="/images/edificio.jpeg"
                  {...t.company}
                  to="/company"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="why-us" id="por-que-nosotros">
          <div className="container">
            <h2 className="why-us__title">{t.whyUsTitle}</h2>
            <div className="why-us__grid">
              {/* Candidates Column */}
              <div className="why-us__col why-us__col--candidate">
                <span className="why-us__eyebrow">
                  {t.candidateBenefits.eyebrow}
                </span>
                <h3 className="why-us__subtitle">
                  {t.candidateBenefits.title}
                </h3>
                <ul className="why-us__list">
                  {t.candidateBenefits.points.map((point, index) => (
                    <li className="why-us__item" key={index}>
                      <span className="why-us__check">✓</span>
                      <p>{point}</p>
                    </li>
                  ))}
                </ul>
                <div className="why-us__actions">
                  <Link to="/candidate" className="button button--candidate">
                    {t.candidateBenefits.ctaSignup}
                  </Link>
                  <Link to="/candidate" className="button button--outline">
                    {t.candidateBenefits.ctaLearn}
                  </Link>
                </div>
              </div>

              {/* Companies Column */}
              <div className="why-us__col why-us__col--company">
                <span className="why-us__eyebrow">
                  {t.companyBenefits.eyebrow}
                </span>
                <h3 className="why-us__subtitle">{t.companyBenefits.title}</h3>
                <ul className="why-us__list">
                  {t.companyBenefits.points.map((point, index) => (
                    <li className="why-us__item" key={index}>
                      <span className="why-us__check">✓</span>
                      <p>{point}</p>
                    </li>
                  ))}
                </ul>
                <div className="why-us__actions">
                  <Link to="/company" className="button button--company">
                    {t.companyBenefits.ctaSignup}
                  </Link>
                  <Link to="/company" className="button button--outline">
                    {t.companyBenefits.ctaLearn}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works" id="como-funciona">
          <div className="container">
            <h2>{t.howTitle}</h2>
            <div className="how-it-works__grid">
              {/* Columna candidatos */}
              <div className="how-it-works__col">
                {t.howCandidate.steps.map(([num, title, text]) => (
                  <div className="how-it-works__step" key={num}>
                    <span className="how-it-works__num">{num}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna empresas */}
              <div className="how-it-works__col">
                {t.howCompany.steps.map(([num, title, text]) => (
                  <div className="how-it-works__step" key={num}>
                    <span className="how-it-works__num">{num}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="trust" id="confianza">
          <div className="container">
            <h2>{t.trustTitle}</h2>
            <div className="trust__grid">
              {t.trust.map(([title, text], index) => (
                <article key={title}>
                  <span className="trust__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
