import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- INÍCIO ---
const originalFetch = window.fetch; // 1. Salva o fetch original

window.fetch = async (...args) => {
  let [resource, config] = args;

  // 2. Garante que o objeto de configuração existe
  if (!config) {
    config = {};
  }
  
  // 3. Garante que o objeto headers existe
  if (!config.headers) {
    config.headers = {};
  }

  // 4. Pega o token e INJETA no cabeçalho
  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // 5. Chama o fetch original com o token injetado
  const response = await originalFetch(resource, config);

  // 6. (Opcional) Verifica se deu erro de autenticação globalmente
  if (response.status === 401 || response.status === 403) {
    // Evita loop infinito se a página de login der erro
    if (!window.location.pathname.includes("/login")) {
       localStorage.clear();
       window.location.href = "/login";
    }
  }

  return response;
};
// --- FIM ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)