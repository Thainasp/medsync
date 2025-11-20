import React, { createContext, useState } from "react";

const listarMedicamentos = async () => {
  const response = await fetch("http://localhost:3001/medicamentos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export const useMedicamentoContext = () => {
  return React.useContext(MedicamentoContext);
}
const MedicamentoContext = createContext();

export const MedicamentoProvider = ({ children }) => {
  const [medicamentos, setMedicamentos] = useState([]);

  const [medicamentosReceita, setMedicamentosReceita] = useState([]);

  const addMedicamentoReceita = (medicamento) => {
    setMedicamentosReceita([...medicamentosReceita, medicamento]);
  };

  const buscaMedicamentos = async() => {   
    const dados = await listarMedicamentos();
    if (dados) {
      setMedicamentos(dados);
    }
  };
    return (   
    <MedicamentoContext.Provider
      value={{ medicamentos, buscaMedicamentos, medicamentosReceita, addMedicamentoReceita }}
    >
        {children}
    </MedicamentoContext.Provider>
  );
};

export default MedicamentoContext;