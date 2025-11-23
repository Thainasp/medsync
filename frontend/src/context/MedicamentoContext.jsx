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
const salvarMedicamentoAPI = async (medicamento) => {
  const response = await fetch("http://localhost:3001/medicamentos/criar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(medicamento),
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
  const salvarMedicamento = async (medicamento) => {
    const novoMedicamento = await salvarMedicamentoAPI(medicamento);
    return novoMedicamento;
  };

    return (   
    <MedicamentoContext.Provider
      value={{ medicamentos, buscaMedicamentos, medicamentosReceita, addMedicamentoReceita, salvarMedicamento }}
    >
        {children}
    </MedicamentoContext.Provider>
  );
};

export default MedicamentoContext;