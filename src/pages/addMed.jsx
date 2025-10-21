import React, { useState } from "react";

import { QuadroFundo } from "../components/quadroFundo";
import { TextoImportante } from "../components/TextoImportante";
import { TextoLongo } from "../components/TextoLongos";
import { MyButton } from "../components/myButton";
import { TelaBase } from "../components/telaBase";
import {
  FormContainer,
  Label,
  InputField,
  ErrorMessage,
  Legend,
  FormGroup,
} from "../components/forms";

const AdicionarMed = () => {
  const [nomeMedicamento, setNomeMedicamento] = useState("");
  const [dosagem, setDosagem] = useState(0);
  const [dataCompra, setDataCompra] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [qtdUso, setQtdUso] = useState(0);
  const [tipoUso, setTipoUso] = useState("");
  const [qtdDiasTratamento, setQtdDiasTratamento] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Medicamento salvo:", formData);
    alert("Medicamento salvo com sucesso!");
  };
  return (
    <TelaBase>
      <QuadroFundo>
        <TextoImportante>Adicionar Medicamento</TextoImportante>

        <FormContainer>
          <FormGroup>
            <Label htmlFor="medicamento">Medicamento:</Label>
            <InputField
              type="text"
              id="medicamento"
              name="medicamento"
              required
              placeholder="Insira o medicamento"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dosagem">Dosagem:</Label>
            <InputField
              type="number"
              id="dosagem"
              name="dosagem"
              required
              placeholder="Insira Quantidade Comprada"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dada-compra">Data da compra:</Label>
            <InputField
              type="date"
              id="data-compra"
              name="data-compra"
              required
              placeholder="Insira a data da compra"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="frequencia">Frequencia(Em horas):</Label>
            <InputField
              type="number"
              id="frequencia"
              name="frequencia"
              required
              placeholder="Insira a frequencia"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="quantidadeporUso">Quantidade por uso:</Label>
            <InputField
              type="number"
              id="quantidadeporUso"
              name="quantidadeporUso"
              required
              placeholder="Insira a quantidade por uso"
            />
          </FormGroup>
          <div>
            <Legend>Tipo de uso</Legend>
            <input
              type="radio"
              id="Continuo"
              name="uso"
              value="continuo"
              onClick={(e) => setTipoUso(e.target.value)}
            />
            <Label htmlFor="Continuo">Contínuo</Label>
            <input
              type="radio"
              id="Temporario"
              name="uso"
              value="temporario"
              onClick={(e) => setTipoUso(e.target.value)}
            />
            <Label htmlFor="Eventual">Temporario</Label>
          </div>

          {tipoUso === "temporario" && (
            <FormGroup>
              <Label htmlFor="qtdDiasTratamento">Dias de tratamento</Label>
              <InputField
                type="number"
                name="qtdDiasTratamento"
                id="qtdDiasTratamento"
                placeholder="Dias de tratamento"
              />
            </FormGroup>
          )}

          <FormGroup>
            <label htmlFor="AlertaEstoque">
              <input type="checkbox" id="AlertaEstoque" name="AlertaEstoque" />
              Deseja receber alerta de quando seu medicamento estiver acabando?
            </label>
          </FormGroup>

          <FormGroup>
            <label htmlFor="AlertaMedicamento">
              <input
                type="checkbox"
                id="AlertaMedicamento"
                name="AlertaMedicamento"
              />
              Deseja receber alerta para tomar o medicamento?
            </label>
          </FormGroup>

          <FormGroup>
            <label htmlFor="AlertaWhatsapp">
              <input
                type="checkbox"
                id="AlertaWhatsapp"
                name="AlertaWhatsapp"
              />
              Deseja notificações via WhatsApp?
            </label>
          </FormGroup>

          <MyButton type="submit">Salvar</MyButton>
        </FormContainer>
      </QuadroFundo>
    </TelaBase>
  );
};

export default AdicionarMed;
