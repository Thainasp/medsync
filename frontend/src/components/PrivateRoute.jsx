import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  // Verifica se existe o token no navegador
  const token = localStorage.getItem("token");

  // SE tiver token, mostra a página (children)
  // SE NÃO tiver, chuta o usuário de volta para o /login
  return token ? children : <Navigate to="/login" />;
}