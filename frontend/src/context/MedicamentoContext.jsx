import React, { createContext, useState } from "react";


export const useMedicamentoContext = () => {
  return React.useContext(MedicamentoContext);
}
const MedicamentoContext = createContext();

export const MedicamentoProvider = ({ children }) => {
  const [medicamentos, setMedicamentos] = useState([]);

    const adicionarMedicamento = (medicamento) => {
    return cadastrarMedicamento(medicamento).then((response) => {
      if (response.status === 200) {
        setMedicamentos((prevMedicamentos) => [...prevMedicamentos, medicamento]);
      }
        return response;
    });
  };

  const atualizarMedicamento = (medicamentoAtualizado) => {
    return editarMedicamento(medicamentoAtualizado).then((response) => {
      if (response.status === 200) {   
        setMedicamentos((prevMedicamentos) =>
          prevMedicamentos.map((med) =>
            med.nomeMedicamento === medicamentoAtualizado.nomeMedicamento ? medicamentoAtualizado : med
            )
        );
        }   
        return response;
    });
  };    
    return (   
    <MedicamentoContext.Provider
      value={{ medicamentos, adicionarMedicamento, atualizarMedicamento }}
    >
        {children}
    </MedicamentoContext.Provider>
  );
};

export default MedicamentoContext;