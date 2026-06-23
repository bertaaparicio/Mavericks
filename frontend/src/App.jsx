import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CandidatePage } from "./pages/CandidatePage";
import { CompanyPage } from "./pages/CompanyPage";
import { PricingPage } from "./pages/PricingPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";


/** Enrutador principal de la aplicación. */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/candidate" element={<ProtectedRoute><CandidatePage /></ProtectedRoute>} />
      <Route path="/company" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
