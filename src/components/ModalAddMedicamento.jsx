import React, { useState, useEffect }from "react";
import styled from "styled-components";

import {
  FormContainer,
  Label,
  InputField,
  Legend,
  FormGroup,
  Select,
  ErrorMessage, 
} from "../components/forms";
import { MyButton } from "../components/myButton";
import { useMedicamentoContext } from "../context/MedicamentoContext";

import {
    CheckboxLabelGroup,
} from "../components/addreceitastyles";

import { OverlayContainer, ModalWrapper } from "../components/overlay";

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: #75a0d1;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
  &:hover {
    color: #000;
  }
`;


export const ModalAddMedicamento = ({ onClose, onMedicamentoSalvo, listaMedicamentosDisponiveis = [] }) => {
  const { adicionarMedicamento } = useMedicamentoContext();

  const [nomeMedicamento, setNomeMedicamento] = useState("");
  const [dosagem, setDosagem] = useState(0);
  const [dataCompra, setDataCompra] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [qtdUso, setQtdUso] = useState(0);
  const [tipoUso, setTipoUso] = useState("continuo"); // Tipo de Uso: "continuo" como DEFAULT
  const [qtdDiasTratamento, setQtdDiasTratamento] = useState(0);
  const [alertaEstoque, setAlertaEstoque] = useState(false);
  const [alertaMedicamento, setAlertaMedicamento] = useState(false);
  const [alertaWhatsapp, setAlertaWhatsapp] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erros, setErros] = useState({}); 

  // Lógica de Autocomplete/Preenchimento
  const handleNomeChange = (e) => {
    const nome = e.target.value;
    setNomeMedicamento(nome);
    setErros(prev => ({ ...prev, nomeMedicamento: "" }));
    
    const medExistente = listaMedicamentosDisponiveis.find(m => m.nome === nome);
    
    if (medExistente) {
      // Preenche o formulário com dados existentes
      setDosagem(medExistente.dosagem || 0);
      setFrequencia(medExistente.frequencia || "");
      setQtdUso(medExistente.qtdUso || 0);
      setTipoUso(medExistente.tipoUso || "continuo"); 
      setQtdDiasTratamento(medExistente.qtdDiasTratamento || 0);
    } else {
      // Limpa se for um nome novo
      setDosagem(0);
      setFrequencia("");
      setQtdUso(0);
      setTipoUso("continuo"); 
      setQtdDiasTratamento(0);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErros({}); 

    const newErros = {};
    let isValid = true;
    
    // 1. Validação: nomeMedicamento
    if (!nomeMedicamento.trim()) {
        newErros.nomeMedicamento = "O nome do medicamento é obrigatório.";
        isValid = false;
    }

    // 2. Validação: dosagem
    if (!dosagem || Number(dosagem) <= 0) {
        newErros.dosagem = "A dosagem deve ser maior que zero (mg).";
        isValid = false;
    }
    
    // 3. Validação: frequencia
    if (!frequencia) {
        newErros.frequencia = "A frequência é obrigatória.";
        isValid = false;
    }

    // 4. Validação: qtdUso (Quantidade por uso)
    if (!qtdUso || Number(qtdUso) <= 0) {
        newErros.qtdUso = "A quantidade por uso deve ser maior que zero.";
        isValid = false;
    }
    
    // 5. Validação: qtdDiasTratamento (Se tipoUso for 'temporario')
    if (tipoUso === "temporario" && (!qtdDiasTratamento || Number(qtdDiasTratamento) <= 0)) {
        newErros.qtdDiasTratamento = "Para uso temporário, a quantidade de dias é obrigatória.";
        isValid = false;
    }
    
    if (!isValid) {
        setErros(newErros);
        setIsSubmitting(false);
        return; 
    }

    // Lógica de Submissão (Se for válido)
    const medExistente = listaMedicamentosDisponiveis.find(m => m.nome === nomeMedicamento);

    if (medExistente) {
      const medData = {
        ...medExistente, 
        dosagem: Number(dosagem),
        frequencia,
        qtdUso: Number(qtdUso),
        tipoUso,
        qtdDiasTratamento: tipoUso === "temporario" ? Number(qtdDiasTratamento) : 0,
        alertaEstoque,
        alertaMedicamento,
        alertaWhatsapp,
      };
      onMedicamentoSalvo(medData);
      onClose(); 
    } else {
      const formData = {
        nomeMedicamento,
        dosagem: Number(dosagem),
        dataCompra,
        frequencia,
        qtdUso: Number(qtdUso),
        tipoUso,
        qtdDiasTratamento: tipoUso === "temporario" ? Number(qtdDiasTratamento) : 0,
        alertaEstoque,
        alertaMedicamento,
        alertaWhatsapp,
      };

      try {
        const res = await adicionarMedicamento(formData); 
        
        const medicamentoSalvo = {
            ...formData,
            id: res.id || `m${Date.now()}`, 
            nome: nomeMedicamento, 
        };

        onMedicamentoSalvo(medicamentoSalvo); 
        onClose(); 
      } catch (error) {
        console.error("Erro ao salvar novo medicamento:", error);
        alert("Falha ao salvar o novo medicamento.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <OverlayContainer>
      <ModalWrapper>
        <ModalHeader>
          <ModalTitle>Adicionar Medicamento</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <FormContainer onSubmit={handleSubmit}>
          
          {/* CAMPO MEDICAMENTO */}
          <FormGroup>
            <Label htmlFor="medicamento">Medicamento:</Label>
            <InputField
              type="text"
              id="medicamento"
              name="medicamento"
              placeholder="Digite ou selecione um medicamento"
              value={nomeMedicamento}
              onChange={handleNomeChange}
              list="lista-medicamentos-disponiveis" 
            />
            {erros.nomeMedicamento && <ErrorMessage>{erros.nomeMedicamento}</ErrorMessage>}
            
            <datalist id="lista-medicamentos-disponiveis">
                {listaMedicamentosDisponiveis.map((med) => (
                    <option key={med.id} value={med.nome} />
                ))}
            </datalist>
          </FormGroup>

          {/* CAMPO DOSAGEM */}
          <FormGroup>
            <Label htmlFor="dosagem">Dosagem (mg):</Label>
            <InputField
              type="number"
              id="dosagem"
              name="dosagem"
              placeholder="Ex: 500"
              value={dosagem}
              onChange={(e) => {
                setDosagem(e.target.value);
                setErros(prev => ({ ...prev, dosagem: "" }));
              }}
            />
            {erros.dosagem && <ErrorMessage>{erros.dosagem}</ErrorMessage>}
          </FormGroup>

          {/* CAMPO DATA DA COMPRA (Opcional) */}
          <FormGroup>
            <Label htmlFor="data-compra">Data da compra (Opcional):</Label>
            <InputField
              type="date"
              id="data-compra"
              name="data-compra"
              placeholder="Insira a data da compra"
              value={dataCompra}
              onChange={(e) => setDataCompra(e.target.value)}
            />
          </FormGroup>

          {/* CAMPO FREQUÊNCIA */}
          <FormGroup>
            <Label htmlFor="frequencia">Frequência:</Label>
            <Select 
                id="frequencia" 
                value={frequencia}
                onChange={(e) => {
                    setFrequencia(e.target.value);
                    setErros(prev => ({ ...prev, frequencia: "" }));
                }}
            >
              <option value="">--</option>
              <option value="option1">De 2 em 2 horas</option>
              <option value="option2">De 4 em 4 horas</option>
              <option value="option3">De 6 em 6 horas</option>
              <option value="option4">De 8 em 8 horas</option>
              <option value="option5">Uma vez ao dia</option>
              <option value="option6">Uma vez na semana</option>
            </Select>
            {erros.frequencia && <ErrorMessage>{erros.frequencia}</ErrorMessage>}
          </FormGroup>

          {/* CAMPO QUANTIDADE POR USO */}
          <FormGroup>
            <Label htmlFor="quantidadeporUso">Quantidade por uso:</Label>
            <InputField
              type="number"
              id="quantidadeporUso"
              name="quantidadeporUso"
              placeholder="Ex: 1"
              value={qtdUso}
              onChange={(e) => {
                setQtdUso(e.target.value);
                setErros(prev => ({ ...prev, qtdUso: "" }));
              }}
            />
            {erros.qtdUso && <ErrorMessage>{erros.qtdUso}</ErrorMessage>}
          </FormGroup>

          {/* CAMPO TIPO DE USO (RADIO) - 'continuo' marcado por default */}
          <div>
            <Legend>Tipo de uso</Legend>
            <input
              type="radio"
              id="Continuo"
              name="uso"
              value="continuo"
              checked={tipoUso === "continuo"}
              onChange={(e) => {
                setTipoUso(e.target.value);
                setErros(prev => ({ ...prev, qtdDiasTratamento: "" })); 
              }}
            />
            <Label htmlFor="Continuo">Contínuo</Label>
            <input
              type="radio"
              id="Temporario"
              name="uso"
              value="temporario"
              checked={tipoUso === "temporario"}
              onChange={(e) => {
                setTipoUso(e.target.value);
              }}
            />
            <Label htmlFor="Temporario">Temporário</Label>
            {/* O erro para tipoUso não é mais necessário */}
          </div>

          {/* CAMPO DIAS DE TRATAMENTO (CONDICIONAL) */}
          {tipoUso === "temporario" && (
            <FormGroup>
              <Label htmlFor="qtdDiasTratamento">Dias de tratamento</Label>
              <InputField
                type="number"
                name="qtdDiasTratamento"
                id="qtdDiasTratamento"
                placeholder="Dias de tratamento"
                value={qtdDiasTratamento}
                onChange={(e) => {
                    setQtdDiasTratamento(e.target.value);
                    setErros(prev => ({ ...prev, qtdDiasTratamento: "" }));
                }}
              />
              {erros.qtdDiasTratamento && <ErrorMessage>{erros.qtdDiasTratamento}</ErrorMessage>}
            </FormGroup>
          )}

          {/* Checkboxes de Alerta */}
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

          <FormGroup>
          <MyButton type="submit" disabled={isSubmitting} style={{marginTop: "15px"}}>
            {isSubmitting ? "Salvando..." : "Salvar e Adicionar"}
          </MyButton>
          </FormGroup>

        </FormContainer>
      </ModalWrapper>
    </OverlayContainer>
  );
};