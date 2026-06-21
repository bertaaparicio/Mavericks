import { useNavigate } from "react-router-dom";

const labels = {
  ca: "Tornar",
  es: "Volver",
  en: "Back",
};

/**
 * Vuelve a la página anterior. Si la ruta se abrió directamente, vuelve al
 * inicio para evitar que el usuario quede atrapado fuera de la aplicación.
 */
export function BackButton({ language }) {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <button className="back-button" type="button" onClick={goBack}>
      <span aria-hidden="true">←</span>
      {labels[language]}
    </button>
  );
}
