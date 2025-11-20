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
}
export const usePrescricaoETratamentoContext = () => {
  return React.useContext(PrescricaoETratamentoContext);
}
const PrescricaoETratamentoContext = createContext();

export const PrescricaoETratamentoProvider = ({ children }) => {
    const [prescricoes, setPrescricoes] = useState([]);
    const salvarPrescricao = async (prescricao) => {
        const novaPrescricao = await salvarPrescricaoAPI(prescricao);
        return novaPrescricao;
    };
    return (
    <PrescricaoETratamentoContext.Provider
      value={{ prescricoes, salvarPrescricao }}
    >
        {children}
    </PrescricaoETratamentoContext.Provider>
  );
}   
export default PrescricaoETratamentoContext;
