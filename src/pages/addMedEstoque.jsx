import React, { useState } from "react";

import { QuadroFundo } from "../components/quadroFundo";
import { TextoImportante } from "../components/TextoImportante";
import { MyButton } from "../components/myButton";
import { TelaBase } from "../components/telaBase";

import {
  FormContainer,
  Label,
  InputField,
  FormGroup,
} from "../components/forms";

const listaMedicamentos = [
  { id: 1, nome: "Paracetamol 500mg" },
  { id: 2, nome: "Amoxicilina 250mg" },
  { id: 3, nome: "Dorflex" },
  { id: 4, nome: "Ibuprofeno 600mg" },
];

const AddMedEstoque = () => {

  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState("");
  const [dataCompra, setDataCompra] = useState("");
  const [quantidadeComprada, setQuantidadeComprada] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      medicamentoSelecionado,
      quantidadeComprada,
      dataCompra,
    };
    console.log("Estoque atualizado:", formData);
    
  };

  return (
    <TelaBase>
      <QuadroFundo>
        <TextoImportante>Adicionar medicamento ao estoque</TextoImportante>
        <FormContainer onSubmit={handleSubmit}>
          
          <FormGroup>
            <Label htmlFor="medicamento">Medicamento:</Label>
            
            <InputField
              as="select"
              id="medicamento"
              name="medicamento"
              required
              value={medicamentoSelecionado}
              onChange={(e) => setMedicamentoSelecionado(e.target.value)}
            >
              <option value="" disabled>Selecione um medicamento</option>
              {listaMedicamentos.map((med) => (
                <option key={med.id} value={med.nome}>
                  {med.nome}
                </option>
              ))}
            </InputField>
          </FormGroup>


          <FormGroup>
            <Label htmlFor="quantidadeComprada">Quantidade Comprada:</Label>
            <InputField
              type="number"
              id="quantidadeComprada"
              name="quantidadeComprada"
              required
              placeholder="Insira a quantidade adicionada"
              value={quantidadeComprada}
              onChange={(e) => setQuantidadeComprada(e.target.value)}
            />
          </FormGroup>


          <FormGroup>
            <Label htmlFor="data-compra">Data da compra:</Label>
            <InputField
              type="date"
              id="data-compra"
              name="data-compra"
              required
              placeholder="Insira a data da compra"
              value={dataCompra}
              onChange={(e) => setDataCompra(e.target.value)}
            />
          </FormGroup>

          <MyButton type="submit">Atualizar Estoque</MyButton>

        </FormContainer>
      </QuadroFundo>
    </TelaBase>
  );
};

export { AddMedEstoque };