import React, { createContext, useState } from "react";

const salvarPrescricaoAPI = async (prescricao) => {
  const response = await fetch("http://localhost:3001/prescricoes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prescricao),
  });
  return response.json();
};

const salvarTratamentoAPI = async (tratamento) => {
  const response = await fetch("http://localhost:3001/tratamentos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tratamento),
  });
  return response.json();
};

const salvarTratamentoHasPrescricaoAPI = async (tratamento) => {
  const response = await fetch("http://localhost:3001/tratamento-prescricao/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tratamento),
  });
  return response.json();
};

export const usePrescricaoETratamentoContext = () => {
  return React.useContext(PrescricaoETratamentoContext);
};
const PrescricaoETratamentoContext = createContext();

export const PrescricaoETratamentoProvider = ({ children }) => {
  const [prescricoes, setPrescricoes] = useState([]);

  const salvarPrescricao = async (prescricao) => {
    const novaPrescricao = await salvarPrescricaoAPI(prescricao);
    return novaPrescricao;
  };

  const salvarTratamento = async (tratamento) => {
    const novoTratamento = await salvarTratamentoAPI(tratamento);
    return novoTratamento;
  };

  const salvarTratamentoHasPrescricao = async (tratamento) => {
    const novoVinculo = await salvarTratamentoHasPrescricaoAPI(tratamento);
    return novoVinculo;
  };

  return (
    <PrescricaoETratamentoContext.Provider
      value={{
        prescricoes,
        salvarPrescricao,
        salvarTratamento,
        salvarTratamentoHasPrescricao,
      }}
    >
      {children}
    </PrescricaoETratamentoContext.Provider>
  );
};
export default PrescricaoETratamentoContext;
