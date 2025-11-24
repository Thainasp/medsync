// Define onde o backend está rodando
const BASE_URL = "http://localhost:3001";

export const apiFetch = async (endpoint, options = {}) => {
  // 1. Pega o token salvo no navegador
  const token = localStorage.getItem("token");

  // 2. Prepara os cabeçalhos
  const headers = {
    "Content-Type": "application/json",
    ...options.headers, // Mantém headers extras se houver
  };

  // 3. Se tiver token, coloca ele na requisição
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 4. Faz a chamada (fetch) juntando a URL base + o endpoint (ex: /medicamentos)
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 5. Tratamento básico de erro de sessão
  if (response.status === 401 || response.status === 403) {
    console.warn("Sessão expirada ou inválida");
    // Opcional: Redirecionar para login automaticamente
    // window.location.href = "/login";
  }

  return response;
};