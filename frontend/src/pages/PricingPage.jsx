import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BackButton } from "../components/BackButton";
import { useLanguage } from "../context/LanguageContext";

/**
 * Página reservada para los futuros planes dirigidos a personas que buscan
 * empleo. Se mantiene deliberadamente vacía hasta definir precios y ventajas.
 */
export function PricingPage() {
  const { language } = useLanguage();

  return (
    <div className="pricing-page">
      <Header language={language} portal="pricing" />
      <main className="pricing-main">
        <BackButton language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}
