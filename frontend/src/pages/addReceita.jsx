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

// Simulação (MOCK) ---

const mockMedicamentosIniciais = [
  {
    id: "m1",
    nome: "Lamotrigina 5mg",
    dosagem: 5,
    frequencia: "option4",
    qtdUso: 1,
    tipoUso: "continuo",
  },
  {
    id: "m2",
    nome: "Ansitec 5mg",
    dosagem: 5,
    frequencia: "option3",
    qtdUso: 1,
    tipoUso: "temporario",
    qtdDiasTratamento: 7,
  },
  {
    id: "m3",
    nome: "Paracetamol 500mg",
    dosagem: 500,
    frequencia: "option2",
    qtdUso: 1,
    tipoUso: "temporario",
    qtdDiasTratamento: 3,
  },
  {
    id: "m4",
    nome: "Amoxicilina 250mg",
    dosagem: 250,
    frequencia: "option4",
    qtdUso: 2,
    tipoUso: "temporario",
    qtdDiasTratamento: 5,
  },
];

const useReceitaContext = () => {
  const adicionarReceita = async (data) => {
    console.log("Receita adicionada (MOCK):", data);
    return { success: true, id: Date.now() };
  };
  const atualizarReceita = async (data) => {
    console.log("Receita atualizada (MOCK):", data);
    return { success: true };
  };
  return { adicionarReceita, atualizarReceita };
};
// ----------------------------------------------------------------

const AddReceita = ({ isEdit = false, receita = {} }) => {
  const { adicionarReceita, atualizarReceita } = useReceitaContext();
  const { adicionarMedicamento: adicionarMedContext } = useMedicamentoContext();

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
  const [medicamentosReceita, setMedicamentosReceita] = useState(
    initMedicamentosReceita
  );

  const [erros, setErros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sucessoEnviado, setSucessoEnviado] = useState(false);
  const [sucessoAdicionado, setSucessoAdicionado] = useState(false);
  const [sucessoRemovido, setSucessoRemovido] = useState(false);

  const [showDeleteMedPopup, setShowDeleteMedPopup] = useState(false);
  const [medToDelete, setMedToDelete] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listaMedicamentosDisponiveis, setListaMedicamentosDisponiveis] =
    useState(mockMedicamentosIniciais);

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
    const isNewInMasterList = !listaMedicamentosDisponiveis.some(
      (m) => m.id === medicamentoSalvo.id
    );
    if (isNewInMasterList) {
      setListaMedicamentosDisponiveis([
        ...listaMedicamentosDisponiveis,
        medicamentoSalvo,
      ]);
    }

    const isDuplicateInRecipe = medicamentosReceita.some(
      (med) => med.id === medicamentoSalvo.id
    );
    if (isDuplicateInRecipe) {
      alert("Este medicamento já foi adicionado à receita.");
      setIsModalOpen(false);
      return;
    }

    setMedicamentosReceita((prevMeds) => {
      // Limpa o erro de medicamento se a lista estava vazia
      if (prevMeds.length === 0 && erros.medicamentos) {
        setErros((prev) => ({ ...prev, medicamentos: "" }));
      }
      return [
        ...prevMeds,
        {
          id: medicamentoSalvo.id,
          nome: medicamentoSalvo.nome,
          dosagem: medicamentoSalvo.dosagem,
          frequencia: medicamentoSalvo.frequencia,
          qtdUso: medicamentoSalvo.qtdUso,
          tipoUso: medicamentoSalvo.tipoUso,
          qtdDiasTratamento: medicamentoSalvo.qtdDiasTratamento || 0,
          alertaEstoque: medicamentoSalvo.alertaEstoque,
          alertaMedicamento: medicamentoSalvo.alertaMedicamento,
          alertaWhatsapp: medicamentoSalvo.alertaWhatsapp,
        },
      ];
    });

    setSucessoAdicionado(true);
    setTimeout(() => setSucessoAdicionado(false), 2500);

    setIsModalOpen(false);
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
  const handleSubmit = (e) => {
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
    const formData = {
      nomeReceita,
      dataReceita,
      observacoes,
      medicamentosReceita,
      alertaVencimento,
      notificacaoMed,
    };

    const acao = isEdit ? atualizarReceita : adicionarReceita;

    acao(formData)
      .then((res) => {
        console.log("Receita salva com sucesso!", res);
        setSucessoEnviado(true);
        setTimeout(() => {
          setSucessoEnviado(false);
          navigate("/receitas");
        }, 3000);
      })
      .catch((error) => {
        console.error("Erro ao salvar a receita:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
