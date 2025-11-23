import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import { QuadroFundo } from "../components/quadroFundo";
import { TextoImportante } from "../components/TextoImportante";
import { MyButton } from "../components/myButton";
import { TelaBase } from "../components/telaBase";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import {
  OverlayContainer,
  OverlayIcon,
  OverlayTitle,
  OverlayContent,
  PopupButton,
  ConfirmButton,
  CancelButton,
  OverlayText,
} from "../components/overlay";
import { FormGroup, Label, Legend, ErrorMessage } from "../components/forms";

import {
  ReceitaFormContainer,
  ReceitaInputField,
  TextAreaField,
  ListaMedicamentos,
  ItemMedicamento,
  DeleteButton,
  TrashIconComponent,
  CheckboxLabelGroup,
} from "../components/addreceitastyles";

import { ModalAddMedicamento } from "../components/ModalAddMedicamento";
import { useMedicamentoContext } from "../context/MedicamentoContext";
import { useReceitaContext } from "../context/ReceitaContext";
import { usePrescricaoETratamentoContext } from "../context/PrescricaoETratamentoContext";

const AddReceita = ({ isEdit = false, receita = {} }) => {
  const { salvarReceita } = useReceitaContext();
  const { salvarMedicamento, medicamentosReceita } = useMedicamentoContext();

  const { salvarPrescricao } = usePrescricaoETratamentoContext();
  const navigate = useNavigate();

  // Dados Iniciais da Receita
  const {
    nomeReceita: initNomeReceita = "",
    dataReceita: initDataReceita = "",
    observacoes: initObservacoes = "",
    medicamentosReceita: initMedicamentosReceita = [],
    alertaVencimento: initAlertaVencimento = false,
    notificacaoMed: initNotificacaoMed = false,
  } = receita;

  // Estados da Receita e Inputs
  const [nomeReceita, setNomeReceita] = useState(initNomeReceita);
  const [dataReceita, setDataReceita] = useState(initDataReceita);
  const [observacoes, setObservacoes] = useState(initObservacoes);
  const [alertaVencimento, setAlertaVencimento] =
    useState(initAlertaVencimento);
  const [notificacaoMed, setNotificacaoMed] = useState(initNotificacaoMed);
  const [erros, setErros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sucessoEnviado, setSucessoEnviado] = useState(false);
  const [sucessoAdicionado, setSucessoAdicionado] = useState(false);
  const [sucessoRemovido, setSucessoRemovido] = useState(false);

  const [showDeleteMedPopup, setShowDeleteMedPopup] = useState(false);
  const [medToDelete, setMedToDelete] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efeito para carregar dados iniciais em modo edição
  useEffect(() => {
    if (isEdit && Object.keys(receita).length > 0) {
      setNomeReceita(receita.nomeReceita || "");
      setDataReceita(receita.dataReceita || "");
      setObservacoes(receita.observacoes || "");
      setAlertaVencimento(receita.alertaVencimento || false);
      setNotificacaoMed(receita.notificacaoMed || false);
      setMedicamentosReceita(receita.medicamentosReceita || []);
    }
  }, [isEdit, receita]);

  const handleMedicamentoSalvo = (medicamentoSalvo) => {
    const isDuplicateInRecipe = medicamentosReceita.some((med) => {
      return med.nome === medicamentoSalvo.nome;
    });
    if (isDuplicateInRecipe) {
      alert("Este medicamento já foi adicionado à receita.");
      setIsModalOpen(false);
      return;
    }

    setSucessoAdicionado(true);
    setTimeout(() => setSucessoAdicionado(false), 2500);

    setIsModalOpen(false);
    return true;
  };

  // Abre o pop-up de confirmação de exclusão
  const handleDeleteClick = (id) => {
    const med = medicamentosReceita.find((m) => m.id === id);
    if (med) {
      setMedToDelete(med);
      setShowDeleteMedPopup(true);
    }
  };

  // Executa a exclusão após a confirmação
  const confirmDeleteMedicamento = () => {
    if (medToDelete && medToDelete.id) {
      setMedicamentosReceita(
        medicamentosReceita.filter((med) => med.id !== medToDelete.id)
      );

      // Exibe o pop-up de SUCESSO de remoção
      setSucessoRemovido(true);
      setTimeout(() => setSucessoRemovido(false), 2500);
    }
    // Fecha o pop-up
    setShowDeleteMedPopup(false);
    setMedToDelete(null);
  };

  // Cancela a exclusão
  const cancelDeleteMedicamento = () => {
    setShowDeleteMedPopup(false);
    setMedToDelete(null);
  };

  //  Submissão Manual e Validação ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErros = {};
    let isValid = true;

    if (!nomeReceita.trim()) {
      newErros.nomeReceita = "O nome da receita é obrigatório.";
      isValid = false;
    }

    if (!dataReceita) {
      newErros.dataReceita = "A data da receita é obrigatória.";
      isValid = false;
    }

    if (medicamentosReceita.length === 0) {
      newErros.medicamentos = "Adcione ao menos um medicamento.";
      isValid = false;
    }

    setErros(newErros);

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    // Se válido, prepara os dados e salva
      // Converte data ISO (YYYY-MM-DD) do input `type="date"` para DD/MM/YYYY esperado pelo backend
      const isoToBR = (iso) => {
        if (!iso) return iso;
        const parts = iso.split('-');
        if (parts.length !== 3) return iso;
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
      };

      const formData = {
        nomeReceita,
        Paciente_idPaciente: 1, // pessoa responsavel pelo paciente add id
        dataReceita: isoToBR(dataReceita),
        observacoes,
        medicamentosReceita,
        alertaVencimento,
        notificacaoMed,
      };

    try {
      // Salva todos os medicamentos primeiro (em paralelo) e obtém os ids retornados
      const medicamentosComId = [];
      if (medicamentosReceita.length > 0) {
        const savedMedicamentos = await Promise.all(
          medicamentosReceita.map((med) => salvarMedicamento(med))
        );
        // Mapear resultados para o formato esperado
        savedMedicamentos.forEach((medBanco, idx) => {
          const original = medicamentosReceita[idx];
          const idMedicamento = medBanco.id || medBanco.idMedicamento || medBanco.ID || medBanco.id_med;
          medicamentosComId.push({ ...original, idMedicamento });
        });
      }

      const receita = await salvarReceita(formData);
      const receitaId = receita.idReceita || receita.id || receita.ID || receita.id_receita;

      // Cria prescrições para cada medicamento salvo (em paralelo)
      if (medicamentosComId.length > 0) {
        await Promise.all(
          medicamentosComId.map((med) => {
            const prescricaoData = {
              Receita_idReceita: receitaId,
              Medicamento_idMedicamento: med.idMedicamento || med.id || med.idMedicamento,
              frequencia: med.frequencia,
              quantidade: med.qtdUso || med.quantidade,
              data_inicio: med.data_inicio,
            };
            console.log(prescricaoData);
            return salvarPrescricao(prescricaoData);
          })
        );
      }

      console.log("Receita salva com sucesso!", formData);
      /* setSucessoEnviado(true);
      setTimeout(() => {
        setSucessoEnviado(false);
        navigate("/receitas");
      }, 3000); */
    } catch (error) {
      console.error("Erro ao salvar a receita:", error);
      // Se o backend retornou uma mensagem, exibe-a ao usuário
      alert(error && error.message ? `Falha ao salvar receita: ${error.message}` : "Erro ao salvar a receita. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função auxiliar para formatar o nome do medicamento
  const formatarNomeMedicamento = (med) => {
    let texto = `${med.nome}`;
    if (med.dosagem) {
      texto += ` - ${med.dosagem}mg`;
    }
    if (med.frequencia) {
      const freqOption = [
        { value: "option", label: "--" },
        { value: "option1", label: "De 2 em 2 horas" },
        { value: "option2", label: "De 4 em 4 horas" },
        { value: "option3", label: "De 6 em 6 horas" },
        { value: "option4", label: "De 8 em 8 horas" },
        { value: "option5", label: "Uma vez ao dia" },
        { value: "option6", label: "Uma vez na semana" },
      ].find((o) => o.value === med.frequencia);
      if (freqOption) {
        texto += ` (${freqOption.label})`;
      }
    }
    return texto;
  };

  return (
    <TelaBase>
      <Header />

      {/* Overlay de Sucesso (Receita Salva) */}
      {sucessoEnviado && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
            <OverlayTitle>Receita salva com sucesso!</OverlayTitle>
          </OverlayContent>
        </OverlayContainer>
      )}

      {/* Overlay de Sucesso (Medicamento Adicionado) */}
      {sucessoAdicionado && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
            <OverlayTitle>Medicamento adicionado com sucesso!</OverlayTitle>
          </OverlayContent>
        </OverlayContainer>
      )}

      {/* Overlay de Sucesso (Medicamento Removido) */}
      {sucessoRemovido && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
            <OverlayTitle>Medicamento removido com sucesso!</OverlayTitle>
          </OverlayContent>
        </OverlayContainer>
      )}

      {/* MODAL DE ADICIONAR MEDICAMENTO */}
      {isModalOpen && (
        <ModalAddMedicamento
          onClose={() => setIsModalOpen(false)}
          onMedicamentoSalvo={handleMedicamentoSalvo}
        />
      )}

      <QuadroFundo>
        <TextoImportante>
          {isEdit ? "Editar Receita" : "Nova Receita"}
        </TextoImportante>

        <ReceitaFormContainer onSubmit={handleSubmit}>
          {/* Nome da Receita (Obrigatório) */}
          <FormGroup>
            <Label htmlFor="nome-receita">Nome da Receita:</Label>
            <ReceitaInputField
              type="text"
              id="nome-receita"
              name="nome-receita"
              placeholder="Insira o nome da receita"
              value={nomeReceita}
              onChange={(e) => {
                setNomeReceita(e.target.value);
                setErros((prev) => ({ ...prev, nomeReceita: "" }));
              }}
            />
            {erros.nomeReceita && (
              <ErrorMessage>{erros.nomeReceita}</ErrorMessage>
            )}
          </FormGroup>

          {/* Data da Receita (Obrigatório) */}
          <FormGroup>
            <Label htmlFor="data-receita">Data da Receita:</Label>
            <ReceitaInputField
              type="date"
              id="data-receita"
              name="data-receita"
              placeholder="Insira a data da receita"
              value={dataReceita}
              onChange={(e) => {
                setDataReceita(e.target.value);
                setErros((prev) => ({ ...prev, dataReceita: "" }));
              }}
            />
            {erros.dataReceita && (
              <ErrorMessage>{erros.dataReceita}</ErrorMessage>
            )}
          </FormGroup>

          {/* Observações */}
          <FormGroup>
            <Label htmlFor="observacoes">Observações:</Label>
            <TextAreaField
              id="observacoes"
              name="observacoes"
              placeholder="Insira observações (opcional)"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </FormGroup>

          <Legend style={{ marginTop: "20px" }}>Medicamentos na Receita</Legend>

          <MyButton
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{ marginBottom: "15px" }}
          >
            Adicionar Medicamento
          </MyButton>

          {/* Exibição do erro de medicamentos (Obrigatório) */}
          {erros.medicamentos && (
            <ErrorMessage style={{ marginBottom: "15px" }}>
              {erros.medicamentos}
            </ErrorMessage>
          )}

          {/* Lista de Medicamentos Adicionados */}
          {medicamentosReceita.length > 0 && (
            <ListaMedicamentos>
              {medicamentosReceita.map((med) => (
                <ItemMedicamento key={med.id}>
                  • {formatarNomeMedicamento(med)}
                  <DeleteButton
                    type="button"
                    onClick={() => handleDeleteClick(med.id)}
                    aria-label={`Remover ${med.nome}`}
                  >
                    <TrashIconComponent />
                  </DeleteButton>
                </ItemMedicamento>
              ))}
            </ListaMedicamentos>
          )}

          {/* Checkboxes de Alerta */}
          <FormGroup>
            <CheckboxLabelGroup htmlFor="alerta-vencimento">
              <input
                type="checkbox"
                id="alerta-vencimento"
                name="alerta-vencimento"
                checked={alertaVencimento}
                onChange={(e) => setAlertaVencimento(e.target.checked)}
              />
              Deseja receber alerta de vencimento de receita?
            </CheckboxLabelGroup>
          </FormGroup>

          <FormGroup>
            <CheckboxLabelGroup htmlFor="notificacaoMedicamento">
              <input
                type="checkbox"
                id="notificacaoMedicamento"
                name="notificacaoMedicamento"
                checked={notificacaoMed}
                onChange={(e) => setNotificacaoMed(e.target.checked)}
              />
              Receber alerta de tomada dos medicamentos dessa receita?
            </CheckboxLabelGroup>
          </FormGroup>

          {/* Botão de Submissão */}
          <MyButton
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: "20px" }}
          >
            {isSubmitting ? "Salvando..." : "Salvar Receita"}
          </MyButton>
        </ReceitaFormContainer>
      </QuadroFundo>

      {/* POP-UP DE CONFIRMAÇÃO DE EXCLUSÃO DE MEDICAMENTO */}
      {showDeleteMedPopup && medToDelete && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayTitle>Confirmação de Exclusão</OverlayTitle>
            <OverlayText>
              Tem certeza que deseja remover o medicamento **"{medToDelete.nome}
              "** da receita?
            </OverlayText>
            <div>
              <ConfirmButton onClick={confirmDeleteMedicamento}>
                Excluir
              </ConfirmButton>
              <CancelButton onClick={cancelDeleteMedicamento}>
                Cancelar
              </CancelButton>
            </div>
          </OverlayContent>
        </OverlayContainer>
      )}

      <Footer />
    </TelaBase>
  );
};

export { AddReceita };
