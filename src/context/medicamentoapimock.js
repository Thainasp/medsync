// mock de endpoint de backend par cadastrar medicamento
export const cadastrarMedicamento = async (medicamento) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Medicamento cadastrado:", medicamento);
      resolve({ status: 200, message: "Medicamento cadastrado com sucesso!" });
    }, 1000);
  });
};

export const editarMedicamento = async (medicamento) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Medicamento editado:", medicamento);
      resolve({ status: 200, message: "Medicamento editado com sucesso!" });
    }, 1000);
  });
};