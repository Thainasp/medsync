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

const listarMedicamentosByReceitaId = async (idReceita) => {
  const response = await fetch(`http://localhost:3001/medicamentos/receita/${idReceita}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Resposta da API:", response);
  return response.json();
};

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
  const buscarMedicamentosByReceitaId = async (idReceita) => {
    const dados = await listarMedicamentosByReceitaId(idReceita);
    return dados;
  };
    return (
      <MedicamentoContext.Provider
        value={{
          medicamentos,
          buscaMedicamentos,
          medicamentosReceita,
          addMedicamentoReceita,
          salvarMedicamento,
          buscarMedicamentosByReceitaId,
        }}
      >
        {children}
      </MedicamentoContext.Provider>
    );
};

export default MedicamentoContext;