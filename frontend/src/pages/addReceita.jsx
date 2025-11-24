import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
import { useReceitaContext } from "../context/ReceitaContext";

const AddReceita = ({ isEdit = false, receita = {} }) => {
  // Simplificamos: só precisamos do contexto de Receita
  const { salvarReceita } = useReceitaContext();
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

  // Estados
  const [nomeReceita, setNomeReceita] = useState(initNomeReceita);
  const [dataReceita, setDataReceita] = useState(initDataReceita);
  const [observacoes, setObservacoes] = useState(initObservacoes);
  const [medicamentosReceitaState, setMedicamentosReceita] = useState(initMedicamentosReceita);
  
  const [alertaVencimento, setAlertaVencimento] = useState(initAlertaVencimento);
  const [notificacaoMed, setNotificacaoMed] = useState(initNotificacaoMed);
  
  const [erros, setErros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados de Feedback Visual
  const [sucessoEnviado, setSucessoEnviado] = useState(false);
  const [sucessoAdicionado, setSucessoAdicionado] = useState(false);
  const [sucessoRemovido, setSucessoRemovido] = useState(false);

  const [showDeleteMedPopup, setShowDeleteMedPopup] = useState(false);
  const [medToDelete, setMedToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carregar dados na edição
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

  // Adiciona medicamento na lista TEMPORÁRIA (local)
  const handleMedicamentoSalvo = (medicamentoSalvo) => {
    // Gera um ID temporário se não tiver, para controle de lista visual
    const medComId = { ...medicamentoSalvo, id: Date.now() };

    const isDuplicateInRecipe = medicamentosReceitaState.some((med) => {
      return med.nome === medicamentoSalvo.nome;
    });
    if (isDuplicateInRecipe) {
      alert("Este medicamento já foi adicionado à receita.");
      setIsModalOpen(false);
      return;
    }

    setMedicamentosReceita((prev) => [...prev, medComId]);
    
    setSucessoAdicionado(true);
    setTimeout(() => setSucessoAdicionado(false), 2500);

    setIsModalOpen(false);
    return true;
  };

  const handleDeleteClick = (id) => {
    const med = medicamentosReceitaState.find((m) => m.id === id);
    if (med) {
      setMedToDelete(med);
      setShowDeleteMedPopup(true);
    }
  };

  const confirmDeleteMedicamento = () => {
    if (medToDelete) {
      setMedicamentosReceita(
        medicamentosReceitaState.filter((med) => med.id !== medToDelete.id)
      );
      setSucessoRemovido(true);
      setTimeout(() => setSucessoRemovido(false), 2500);
    }
    setShowDeleteMedPopup(false);
    setMedToDelete(null);
  };

  const cancelDeleteMedicamento = () => {
    setShowDeleteMedPopup(false);
    setMedToDelete(null);
  };

  // --- SUBMISSÃO SIMPLIFICADA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErros({});

    // Validações Básicas
    const newErros = {};
    if (!nomeReceita.trim()) newErros.nomeReceita = "Nome obrigatório.";
    if (!dataReceita) newErros.dataReceita = "Data obrigatória.";
    if (medicamentosReceitaState.length === 0) newErros.medicamentos = "Adicione ao menos um medicamento.";

    if (Object.keys(newErros).length > 0) {
      setErros(newErros);
      setIsSubmitting(false);
      return;
    }

    // Converte data YYYY-MM-DD para DD/MM/YYYY
    const isoToBR = (iso) => {
      if (!iso) return iso;
      const parts = iso.split('-');
      return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : iso;
    };

    // Prepara o objeto COMPLETO para o backend
    const formData = {
      nomeReceita,
      dataReceita: isoToBR(dataReceita),
      observacoes,
      medicamentosReceita: medicamentosReceitaState, // Manda o array todo, o backend se vira!
      alertaVencimento,
      notificacaoMed,
    };

    try {
      // Chama apenas UMA função. O Backend cria Receita + Medicamentos + Prescrições em transação.
      await salvarReceita(formData);

      console.log("Receita salva com sucesso!");
      setSucessoEnviado(true);
      
      setTimeout(() => {
        setSucessoEnviado(false);
        navigate("/receitas"); // Redireciona para a listagem
      }, 2000);

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.message || "Erro ao salvar a receita. Verifique se você está logado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatarNomeMedicamento = (med) => {
    let texto = `${med.nome}`;
    if (med.dosagem) texto += ` - ${med.dosagem}mg`;
    
    const freqMap = {
      "1": "De 2 em 2 horas", "2": "De 4 em 4 horas", "3": "De 6 em 6 horas",
      "4": "De 8 em 8 horas", "5": "Uma vez ao dia", "6": "Uma vez na semana"
    };
    if (med.frequencia && freqMap[med.frequencia]) {
      texto += ` (${freqMap[med.frequencia]})`;
    }
    return texto;
  };

  return (
    <TelaBase>
      <Header />

      {/* Overlays de Sucesso */}
      {sucessoEnviado && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
            <OverlayTitle>Receita salva com sucesso!</OverlayTitle>
          </OverlayContent>
        </OverlayContainer>
      )}
      {sucessoAdicionado && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
            <OverlayTitle>Medicamento adicionado à lista!</OverlayTitle>
          </OverlayContent>
        </OverlayContainer>
      )}
      {sucessoRemovido && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
            <OverlayTitle>Medicamento removido da lista!</OverlayTitle>
          </OverlayContent>
        </OverlayContainer>
      )}

      {/* Modal de Adicionar Medicamento */}
      {isModalOpen && (
        <ModalAddMedicamento
          onClose={() => setIsModalOpen(false)}
          onMedicamentoSalvo={handleMedicamentoSalvo}
        />
      )}

      <QuadroFundo>
        <TextoImportante>{isEdit ? "Editar Receita" : "Nova Receita"}</TextoImportante>

        <ReceitaFormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="nome-receita">Nome da Receita:</Label>
            <ReceitaInputField
              type="text"
              id="nome-receita"
              value={nomeReceita}
              onChange={(e) => {
                setNomeReceita(e.target.value);
                setErros((p) => ({ ...p, nomeReceita: "" }));
              }}
              placeholder="Ex: Receita Dr. Silva"
            />
            {erros.nomeReceita && <ErrorMessage>{erros.nomeReceita}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="data-receita">Data da Receita:</Label>
            <ReceitaInputField
              type="date"
              id="data-receita"
              value={dataReceita}
              onChange={(e) => {
                setDataReceita(e.target.value);
                setErros((p) => ({ ...p, dataReceita: "" }));
              }}
            />
            {erros.dataReceita && <ErrorMessage>{erros.dataReceita}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="observacoes">Observações:</Label>
            <TextAreaField
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Tomar após as refeições..."
            />
          </FormGroup>

          <Legend style={{ marginTop: "20px" }}>Medicamentos na Receita</Legend>
          
          <MyButton type="button" onClick={() => setIsModalOpen(true)} style={{ marginBottom: "15px" }}>
            Adicionar Medicamento
          </MyButton>

          {erros.medicamentos && (
            <ErrorMessage style={{ marginBottom: "15px" }}>{erros.medicamentos}</ErrorMessage>
          )}

          {medicamentosReceitaState.length > 0 && (
            <ListaMedicamentos>
              {medicamentosReceitaState.map((med) => (
                <ItemMedicamento key={med.id}>
                  <span>• {formatarNomeMedicamento(med)}</span>
                  <DeleteButton type="button" onClick={() => handleDeleteClick(med.id)}>
                    <TrashIconComponent />
                  </DeleteButton>
                </ItemMedicamento>
              ))}
            </ListaMedicamentos>
          )}

          <FormGroup>
            <CheckboxLabelGroup htmlFor="alerta-vencimento">
              <input
                type="checkbox"
                id="alerta-vencimento"
                checked={alertaVencimento}
                onChange={(e) => setAlertaVencimento(e.target.checked)}
              />
              Alertar vencimento da receita (30 dias)?
            </CheckboxLabelGroup>
          </FormGroup>

          <FormGroup>
            <CheckboxLabelGroup htmlFor="notificacaoMedicamento">
              <input
                type="checkbox"
                id="notificacaoMedicamento"
                checked={notificacaoMed}
                onChange={(e) => setNotificacaoMed(e.target.checked)}
              />
              Receber alertas de tomada para estes medicamentos?
            </CheckboxLabelGroup>
          </FormGroup>

          <MyButton type="submit" disabled={isSubmitting} style={{ marginTop: "20px" }}>
            {isSubmitting ? "Salvando..." : "Salvar Receita"}
          </MyButton>
        </ReceitaFormContainer>
      </QuadroFundo>

      {/* Pop-up de Confirmação */}
      {showDeleteMedPopup && medToDelete && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayTitle>Excluir Medicamento</OverlayTitle>
            <OverlayText>Remover "{medToDelete.nome}" desta lista?</OverlayText>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px'}}>
              <ConfirmButton onClick={confirmDeleteMedicamento}>Sim, Excluir</ConfirmButton>
              <CancelButton onClick={cancelDeleteMedicamento}>Cancelar</CancelButton>
            </div>
          </OverlayContent>
        </OverlayContainer>
      )}

      <Footer />
    </TelaBase>
  );
};

export { AddReceita };