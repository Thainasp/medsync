import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuadroFundo } from "../components/quadroFundo";
import { TextoImportante } from "../components/TextoImportante";
import { MyButton } from "../components/myButton";
import { TelaBase } from "../components/telaBase";
import { useMedicamentoContext } from "../context/MedicamentoContext";
import {
  FormContainer,
  Label,
  InputField,
  Legend,
  FormGroup,
} from "../components/forms";


const AdicionarMed = ({isEdit=false, medicamento = {} }) => {
  const { adicionarMedicamento, atualizarMedicamento } = useMedicamentoContext();

  const {
    nomeMedicamento: initNomeMedicamento = "",
    dosagem: initDosagem = 0,
    dataCompra: initDataCompra = "",
    frequencia: initFrequencia = "",
    qtdUso: initQtdUso = 0,
    tipoUso: initTipoUso = "",
    qtdDiasTratamento: initQtdDiasTratamento = 0,
    alertaEstoque: initAlertaEstoque = false,
    alertaMedicamento: initAlertaMedicamento = false,
    alertaWhatsapp: initAlertaWhatsapp = false,
  } = medicamento;
  const navigate = useNavigate();
  const [nomeMedicamento, setNomeMedicamento] = useState(initNomeMedicamento);
  const [dosagem, setDosagem] = useState(initDosagem);
  const [dataCompra, setDataCompra] = useState(initDataCompra);
  const [frequencia, setFrequencia] = useState(initFrequencia);
  const [qtdUso, setQtdUso] = useState(initQtdUso);
  const [tipoUso, setTipoUso] = useState(initTipoUso);
  const [qtdDiasTratamento, setQtdDiasTratamento] = useState(initQtdDiasTratamento);
  const [alertaEstoque, setAlertaEstoque] = useState(initAlertaEstoque);
  const [alertaMedicamento, setAlertaMedicamento] = useState(initAlertaMedicamento);
  const [alertaWhatsapp, setAlertaWhatsapp] = useState(initAlertaWhatsapp);
  const [sucessoEnviado, setSucessoEnviado] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      nomeMedicamento,
      dosagem,
      dataCompra,
      frequencia,
      qtdUso,
      tipoUso,
      qtdDiasTratamento,
      alertaEstoque,
      alertaMedicamento,
      alertaWhatsapp,
    };
    const acao = isEdit ? atualizarMedicamento : adicionarMedicamento;
    acao(formData).then((res) => {
      console.log("Medicamento salvo com sucesso!", res);
    });
    setSucessoEnviado(true);
    setTimeout(() => {
      setSucessoEnviado(false);
      navigate("/inicio");
    }, 5000);
  };

  return (
    <TelaBase>
      {sucessoEnviado && <div>Medicamento salvo com sucesso!</div>}
      <QuadroFundo>
        <TextoImportante>{isEdit ? "Editar medicamento" : "Adicionar medicamento"}</TextoImportante>
        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="medicamento">Medicamento:</Label>
            <InputField
              type="text"
              id="medicamento"
              name="medicamento"
              required
              placeholder="Insira o medicamento"
              value={nomeMedicamento}
              onChange={(e) => setNomeMedicamento(e.target.value)}
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
              value={dosagem}
              onChange={(e) => setDosagem(e.target.value)}
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
          <FormGroup>
            <Label htmlFor="frequencia">Frequencia(Em horas):</Label>
            <InputField
              type="number"
              id="frequencia"
              name="frequencia"
              required
              placeholder="Insira a frequencia"
              value={frequencia}
              onChange={(e) => setFrequencia(e.target.value)}
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
              value={qtdUso}
              onChange={(e) => setQtdUso(e.target.value)}
            />
          </FormGroup>
          <div>
            <Legend>Tipo de uso</Legend>
            <input
              type="radio"
              id="Continuo"
              name="uso"
              value="continuo"
              checked={tipoUso === "continuo"}
              onChange={(e) => setTipoUso(e.target.value)}
            />
            <Label htmlFor="Continuo">Contínuo</Label>
            <input
              type="radio"
              id="Temporario"
              name="uso"
              value="temporario"
              checked={tipoUso === "temporario"}
              onChange={(e) => setTipoUso(e.target.value)}
            />
            <Label htmlFor="Temporario">Temporario</Label>
          </div>

          {tipoUso === "temporario" && (
            <FormGroup>
              <Label htmlFor="qtdDiasTratamento">Dias de tratamento</Label>
              <InputField
                type="number"
                name="qtdDiasTratamento"
                id="qtdDiasTratamento"
                placeholder="Dias de tratamento"
                value={qtdDiasTratamento}
                onChange={(e) => setQtdDiasTratamento(e.target.value)}
              />
            </FormGroup>
          )}

          <FormGroup>
            <label htmlFor="AlertaEstoque">
              <input
                type="checkbox"
                id="AlertaEstoque"
                name="AlertaEstoque"
                checked={alertaEstoque}
                onChange={() => setAlertaEstoque(!alertaEstoque)}
              />
              Deseja receber alerta de quando seu medicamento estiver acabando?
            </label>
          </FormGroup>

          <FormGroup>
            <label htmlFor="AlertaMedicamento">
              <input
                type="checkbox"
                id="AlertaMedicamento"
                name="AlertaMedicamento"
                checked={alertaMedicamento}
                onChange={() => setAlertaMedicamento(!alertaMedicamento)}
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
                checked={alertaWhatsapp}
                onChange={() => setAlertaWhatsapp(!alertaWhatsapp)}
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
