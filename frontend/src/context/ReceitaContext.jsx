import React, { createContext, useState, useEffect, useContext } from "react";

const ReceitaContext = createContext();

export const useReceitaContext = () => {
  return useContext(ReceitaContext);
}

// Configure o arquivo `.env` na raiz do projeto com `VITE_API_BASE=http://localhost:3001`
// e reinicie o servidor de desenvolvimento para que a variável seja aplicada.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const listarReceitasAPI = async () => {
  const res = await fetch(`${API_BASE}/receitas`);
  return res.json();
};

const buscarReceitaAPI = async (id) => {
  const res = await fetch(`${API_BASE}/receitas/${id}`);
  return res.json();
};

const salvarReceitaAPI = async (receita) => {
  const res = await fetch(`${API_BASE}/receitas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receita),
  });
  // tenta ler JSON da resposta
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    // se backend retornou objeto com chave `erro`, usa essa mensagem
    const msg = (data && (data.erro || data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
};

const atualizarReceitaAPI = async (id, dados) => {
  const res = await fetch(`${API_BASE}/receitas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res.json();
};

const deletarReceitaAPI = async (id) => {
  const res = await fetch(`${API_BASE}/receitas/${id}`, { method: "DELETE" });
  return res.json();
};


export const ReceitaProvider = ({ children }) => {
  const [receitas, setReceitas] = useState([]);

  const loadReceitas = async () => {
    try {
      const dados = await listarReceitasAPI();
      setReceitas(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error("Erro ao carregar receitas:", err.message || err);
    }
  };

  useEffect(() => {
    loadReceitas();
  }, []);

  const salvarReceita = async (receita) => {
    const nova = await salvarReceitaAPI(receita);
    // Se a API retornar um id, recarrega lista ou adiciona localmente
    if (nova && (nova.idReceita || nova.id)) {
      await loadReceitas();
    }
    return nova;
  };

  const buscarReceita = async (id) => {
    return buscarReceitaAPI(id);
  };

  const atualizarReceita = async (id, dados) => {
    const updated = await atualizarReceitaAPI(id, dados);
    if (updated) await loadReceitas();
    return updated;
  };

  const deletarReceita = async (id) => {
    const resp = await deletarReceitaAPI(id);
    if (resp) await loadReceitas();
    return resp;
  };

  return (
    <ReceitaContext.Provider
      value={{ receitas, loadReceitas, salvarReceita, buscarReceita, atualizarReceita, deletarReceita }}
    >
      {children}
    </ReceitaContext.Provider>
  );
};
export default ReceitaContext;
