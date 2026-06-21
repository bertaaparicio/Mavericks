const partners = [
  { name: "Coursera", logo: "/images/coursera_logo.png" },
  { name: "Ucademy", logo: "/images/ucademy_logo.png" },
  { name: "edX", logo: "/images/EdX_logo.png" },
];

const copy = {
  es: {
    label: "POSIBLES COLABORADORES",
    title: "Plataformas de formación",
  },
  ca: {
    label: "POSSIBLES COL·LABORADORS",
    title: "Plataformes de formació",
  },
  en: {
    label: "POTENTIAL PARTNERS",
    title: "Training platforms",
  },
};

function PartnerGroup({ duplicate = false }) {
  return (
    <div className="training-partners__group" aria-hidden={duplicate || undefined}>
      {partners.map((partner) => (
        <div className="training-partner" key={partner.name}>
          <img src={partner.logo} alt={duplicate ? "" : partner.name} />
        </div>
      ))}
    </div>
  );
}

/** Cinta infinita de logotipos que se desplaza suavemente hacia la izquierda. */
export function TrainingPartnersCarousel({ language = "es" }) {
  const t = copy[language];

  return (
    <section className="training-partners" aria-label={t.title}>
      <div className="training-partners__heading">
        <span>{t.label}</span>
        <h3>{t.title}</h3>
      </div>

      <div className="training-partners__viewport">
        <div className="training-partners__track">
          <PartnerGroup />
          <PartnerGroup duplicate />
        </div>
      </div>
    </section>
  );
}
