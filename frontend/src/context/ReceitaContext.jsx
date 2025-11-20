import React, { createContext, useState } from "react";

export const useReceitaContext = () => {
  return React.useContext(ReceitaContext);
}
const salvarReceitaAPI = async (receita) => {
  const response = await fetch("http://localhost:3001/receitas/", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receita),
  });
  return response.json();
}    
const ReceitaContext = createContext();

export const ReceitaProvider = ({ children }) => {
    const [receitas, setReceitas] = useState([]);

    const salvarReceita = async (receita) => {
      const novaReceita = await salvarReceitaAPI(receita);
      return novaReceita;
    };

    return (   
    <ReceitaContext.Provider
      value={{ receitas, salvarReceita }}
    >
        {children}
    </ReceitaContext.Provider>
  );
}
