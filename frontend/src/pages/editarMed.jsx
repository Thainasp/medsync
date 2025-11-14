import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuadroFundo } from "../components/quadroFundo";
import { TextoImportante } from "../components/TextoImportante";
import { MyButton } from "../components/myButton";
import { TelaBase } from "../components/telaBase";
import { useMedicamentoContext } from "../context/MedicamentoContext";
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
import {
  FormContainer,
  Label,
  InputField,
  Legend,
  FormGroup,
  Select,
  ErrorMessage,
  DeleteButton,
} from "../components/forms";

export function EditarMedicamento({ medicamento = {} }) {
  const { atualizarMedicamento, excluirMedicamento } = useMedicamentoContext();
  const navigate = useNavigate();

  const [nomeMedicamento, setNomeMedicamento] = useState("");
  const [dosagem, setDosagem] = useState(0);
  const [dataCompra, setDataCompra] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [qtdUso, setQtdUso] = useState(0);
  const [tipoUso, setTipoUso] = useState("");
  const [qtdDiasTratamento, setQtdDiasTratamento] = useState(0);
  const [alertaEstoque, setAlertaEstoque] = useState(false);
  const [alertaMedicamento, setAlertaMedicamento] = useState(false);
  const [alertaWhatsapp, setAlertaWhatsapp] = useState(false);
  const [sucessoEnviado, setSucessoEnviado] = useState(false);
  const [erros, setErros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [sucessoExcluido, setSucessoExcluido] = useState(false);

  // useEffect para popular o formulário
  useEffect(() => {
    if (medicamento) {
      const {
        nomeMedicamento = "",
        dosagem = 0,
        dataCompra = "",
        frequencia = "",
        qtdUso = 0,
        tipoUso = "",
        qtdDiasTratamento = 0,
        alertaEstoque = false,
        alertaMedicamento = false,
        alertaWhatsapp = false,
      } = medicamento;

      setNomeMedicamento(nomeMedicamento);
      setDosagem(dosagem);
      setDataCompra(dataCompra);
      setFrequencia(frequencia);
      setQtdUso(qtdUso);
      setTipoUso(tipoUso);
      setQtdDiasTratamento(qtdDiasTratamento);
      setAlertaEstoque(alertaEstoque);
      setAlertaMedicamento(alertaMedicamento);
      setAlertaWhatsapp(alertaWhatsapp);
    }
  }, [medicamento]); 

  // handleSubmit (Atualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErros({});

    // (Lógica de validação...)
    const newErros = {};
    let isValid = true;
    if (!nomeMedicamento.trim()) {
      newErros.nomeMedicamento = "O nome do medicamento é obrigatório.";
      isValid = false;
    }
    if (!dosagem || Number(dosagem) <= 0) {
      newErros.dosagem = "A dosagem deve ser maior que zero (mg).";
      isValid = false;
    }
    if (!frequencia) {
      newErros.frequencia = "A frequência é obrigatória.";
      isValid = false;
    }
    if (!qtdUso || Number(qtdUso) <= 0) {
      newErros.qtdUso = "A quantidade por uso deve ser maior que zero.";
      isValid = false;
    }
    if (tipoUso === "temporario" && (!qtdDiasTratamento || Number(qtdDiasTratamento) <= 0)) {
      newErros.qtdDiasTratamento = "Para uso temporário, a quantidade de dias é obrigatória.";
      isValid = false;
    }
    if (!isValid) {
      setErros(newErros);
      setIsSubmitting(false);
      return;
    }

    const formData = {
      id: medicamento.id,
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

    atualizarMedicamento(formData)
      .then((res) => {
        console.log("Medicamento atualizado com sucesso!", res);
        setSucessoEnviado(true);
        setTimeout(() => {
          setSucessoEnviado(false);
          navigate("/receitas");
        }, 5000); 
      })
      .catch((error) => {
        console.error("Erro ao atualizar medicamento:", error);
        setErros({ submit: "Falha ao atualizar o medicamento. Tente novamente." });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // --- LÓGICA DE EXCLUSÃO  ---
  
  // Abre o pop-up de confirmação
  const handleExcluir = () => {
    setShowConfirmPopup(true);
  };

  // Fecha o pop-up de confirmação
  const handleCancelExcluir = () => {
    setShowConfirmPopup(false);
  };

  // Executa a exclusão e mostra o pop-up de SUCESSO
  const handleConfirmExcluir = () => {
    console.log("Excluindo medicamento com ID:", medicamento.id);
    
    // Fecha o pop-up de CONFIRMAÇÃO
    setShowConfirmPopup(false); 

    // --- Início da Simulação (Remova quando descomentar o código acima) ---
    console.log("Lógica de exclusão (simulada) executada.");
    setSucessoExcluido(true); // Ativa o pop-up de sucesso
    setTimeout(() => {
      setSucessoExcluido(false);
      navigate("/inicio"); // Redireciona após 3 segundos
    }, 3000);
    // --- Fim da Simulação ---
  };
  // ------------------------------------------

  return (
    <TelaBase>
      <Header />
      
      {/* POP-UP de Sucesso na autalização */}
      {sucessoEnviado && (
        <OverlayContainer>
          <OverlayContent>
            <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
            <OverlayTitle>Medicamento atualizado com sucesso!</OverlayTitle>
          </OverlayContent>
        </OverlayContainer>
      )}

      {/* ---  POP-UP DE SUCESSO DE EXCLUSÃO --- */}
      {sucessoExcluido && (
          <OverlayContainer>
              <OverlayContent>
                  <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Success" />
                  <OverlayTitle>Medicamento excluído com sucesso!</OverlayTitle>
              </OverlayContent>
          </OverlayContainer>
      )}

      {/* POP-UP DE CONFIRMAÇÃO (para EXCLUIR) */}
      {showConfirmPopup && (
        <OverlayContainer>
            <OverlayContent>
                <OverlayTitle>
                    Confirmar Exclusão
                </OverlayTitle>
                <OverlayText>
                    Tem certeza que deseja excluir o medicamento 
                    **"{nomeMedicamento}"**? Esta ação não pode ser desfeita.
                </OverlayText>
                <div>
                    <ConfirmButton onClick={handleConfirmExcluir}>
                        Sim, Excluir
                    </ConfirmButton>
                    <CancelButton onClick={handleCancelExcluir}>
                        Cancelar
                    </CancelButton>
                </div>
            </OverlayContent>
        </OverlayContainer>
      )}

      <QuadroFundo>
        <TextoImportante>
          Editar medicamento
        </TextoImportante>
        <FormContainer onSubmit={handleSubmit}>
                    
          <FormGroup>
            <Label htmlFor="medicamento">Medicamento:</Label>
            <InputField
              type="text"
              id="medicamento"
              name="medicamento"
              placeholder="Insira o medicamento"
              value={nomeMedicamento}
              onChange={(e) => {
                setNomeMedicamento(e.target.value);
                setErros(prev => ({ ...prev, nomeMedicamento: "" })); 
              }}
            />
            {erros.nomeMedicamento && <ErrorMessage>{erros.nomeMedicamento}</ErrorMessage>}
          </FormGroup>
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
              onChange={(e) => setTipoUso(e.target.value)}
            />
            <Label htmlFor="Temporario">Temporário</Label>
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
                onChange={(e) => {
                  setQtdDiasTratamento(e.target.value);
                  setErros(prev => ({ ...prev, qtdDiasTratamento: "" }));
                }}
              />
              {erros.qtdDiasTratamento && <ErrorMessage>{erros.qtdDiasTratamento}</ErrorMessage>}
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


          {/* Erro de submit geral */}
          {erros.submit && <ErrorMessage>{erros.submit}</ErrorMessage>}

          <MyButton type="submit" disabled={isSubmitting} style={{marginTop: "15px"}}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </MyButton>

          <DeleteButton type="button" onClick={handleExcluir}>
            Excluir Medicamento
          </DeleteButton>
        </FormContainer>
      </QuadroFundo>
      <Footer />
    </TelaBase>
  );
}