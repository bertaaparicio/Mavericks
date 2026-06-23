import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  es: {
    eyebrow: "BIENVENIDO DE NUEVO",
    title: "Inicia sesión en TalentMatch AI",
    subtitle: "Continúa donde lo dejaste y accede a tu espacio personalizado.",
    candidate: "Candidato",
    company: "Empresa",
    email: "Correo electrónico",
    emailPlaceholder: "nombre@correo.com",
    password: "Contraseña",
    passwordPlaceholder: "Introduce tu contraseña",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    remember: "Recordarme",
    forgot: "¿Has olvidado la contraseña?",
    submit: "Iniciar sesión",
    loading: "Comprobando datos...",
    noAccount: "¿Todavía no tienes cuenta?",
    register: "Crear una cuenta",
    privacy: "Tus credenciales se procesarán de forma segura.",
    invalidEmail: "Introduce un correo electrónico válido.",
    shortPassword: "La contraseña debe tener al menos 6 caracteres.",
    demoSuccess: "Interfaz preparada. El siguiente paso será conectarla al sistema de autenticación.",
    candidateBenefit: "Consulta tus matches, análisis y progreso profesional.",
    companyBenefit: "Gestiona ofertas, formaciones y candidatos compatibles.",
  },
  ca: {
    eyebrow: "BENVINGUT DE NOU",
    title: "Inicia sessió a TalentMatch AI",
    subtitle: "Continua on ho vas deixar i accedeix al teu espai personalitzat.",
    candidate: "Candidat",
    company: "Empresa",
    email: "Correu electrònic",
    emailPlaceholder: "nom@correu.com",
    password: "Contrasenya",
    passwordPlaceholder: "Introdueix la teva contrasenya",
    showPassword: "Mostrar contrasenya",
    hidePassword: "Ocultar contrasenya",
    remember: "Recorda’m",
    forgot: "Has oblidat la contrasenya?",
    submit: "Iniciar sessió",
    loading: "Comprovant les dades...",
    noAccount: "Encara no tens compte?",
    register: "Crear un compte",
    privacy: "Les teves credencials es processaran de manera segura.",
    invalidEmail: "Introdueix un correu electrònic vàlid.",
    shortPassword: "La contrasenya ha de tenir almenys 6 caràcters.",
    demoSuccess: "Interfície preparada. El següent pas serà connectar-la al sistema d’autenticació.",
    candidateBenefit: "Consulta els teus matches, anàlisis i progrés professional.",
    companyBenefit: "Gestiona ofertes, formacions i candidats compatibles.",
  },
  en: {
    eyebrow: "WELCOME BACK",
    title: "Sign in to TalentMatch AI",
    subtitle: "Continue where you left off and access your personalized workspace.",
    candidate: "Candidate",
    company: "Company",
    email: "Email address",
    emailPlaceholder: "name@email.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    remember: "Remember me",
    forgot: "Forgot your password?",
    submit: "Sign in",
    loading: "Checking details...",
    noAccount: "Do not have an account yet?",
    register: "Create an account",
    privacy: "Your credentials will be processed securely.",
    invalidEmail: "Enter a valid email address.",
    shortPassword: "The password must contain at least 6 characters.",
    demoSuccess: "The interface is ready. The next step is connecting it to authentication.",
    candidateBenefit: "Review your matches, analyses and professional progress.",
    companyBenefit: "Manage vacancies, training and compatible candidates.",
  },
};

export function LoginPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [accountType, setAccountType] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage(t.invalidEmail);
      setMessageType("error");
      return;
    }
    if (password.length < 6) {
      setMessage(t.shortPassword);
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    window.setTimeout(() => {
      setLoading(false);
      // Guardar sesión
      localStorage.setItem("talentmatch-user", JSON.stringify({
        role: accountType,  // "candidate" o "company"
        email: email
      }));
      // Redirigir según tipo de cuenta
      if (accountType === "candidate") {
        navigate("/candidate");
      } else {
        navigate("/company");
      }
    }, 650);
  }

  return (
    <div className="login-page">
      <Header portal="login" />
      <main className="login-main">
        <BackButton language={language} />

        <section className="login-layout">
          <div className={`login-aside login-aside--${accountType}`}>
            <span className="login-aside__eyebrow">TalentMatch AI</span>
            <h2>{accountType === "candidate" ? t.candidate : t.company}</h2>
            <p>
              {accountType === "candidate"
                ? t.candidateBenefit
                : t.companyBenefit}
            </p>
            <div className="login-aside__visual" aria-hidden="true">
              <img
                src={accountType === "candidate"
                  ? "/images/cohete.jpeg"
                  : "/images/edificio.jpeg"}
                alt=""
              />
            </div>
          </div>

          <div className="login-panel">
            <div className="login-heading">
              <span>{t.eyebrow}</span>
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>

            <div className="account-switch" role="group" aria-label="Tipo de cuenta">
              <button
                className={accountType === "candidate" ? "is-active" : ""}
                type="button"
                onClick={() => setAccountType("candidate")}
              >
                {t.candidate}
              </button>
              <button
                className={accountType === "company" ? "is-active" : ""}
                type="button"
                onClick={() => setAccountType("company")}
              >
                {t.company}
              </button>
            </div>

            <form className="login-form" onSubmit={submit} noValidate>
              <label>
                <span>{t.email}</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  required
                />
              </label>

              <label>
                <span>{t.password}</span>
                <div className="password-field">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? t.hidePassword : t.showPassword}
                    title={showPassword ? t.hidePassword : t.showPassword}
                  >
                    <span aria-hidden="true">{showPassword ? "◉" : "◎"}</span>
                  </button>
                </div>
              </label>

              <div className="login-options">
                <label className="remember-control">
                  <input name="remember" type="checkbox" />
                  <span>{t.remember}</span>
                </label>
                <Link to="/forgot-password">{t.forgot}</Link>
              </div>

              <button className="button button--candidate login-submit" disabled={loading}>
                {loading ? t.loading : t.submit}
              </button>

              {message && (
                <p className={`login-message login-message--${messageType}`} role="status">
                  {message}
                </p>
              )}
            </form>

            <p className="login-register">
              {t.noAccount} <Link to="/register">{t.register}</Link>
            </p>
            <small className="login-privacy">{t.privacy}</small>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
