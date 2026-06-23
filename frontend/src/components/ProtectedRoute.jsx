import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("talentmatch-user");
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}