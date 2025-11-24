import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import debounce from "lodash.debounce";

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
import { OverlayContainer, ModalWrapper } from "../components/overlay";

// Importe o helper de API que criamos nos passos anteriores
import { apiFetch } from "../services/api"; 

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

export const ModalAddMedicamento = ({ onClose, onMedicamentoSalvo }) => {
  // Não precisamos mais de 'medicamentos' do contexto para o autocomplete
  const { addMedicamentoReceita } = useMedicamentoContext();

  const [nomeMedicamento, setNomeMedicamento] = useState("");
  const [dosagem, setDosagem] = useState(0);
  const [dataCompra, setDataCompra] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [qtdUso, setQtdUso] = useState(0);
  const [tipoUso, setTipoUso] = useState("continuo");
  const [qtdDiasTratamento, setQtdDiasTratamento] = useState(0);
  
  // Alertas
  const [alertaEstoque, setAlertaEstoque] = useState(false);
  const [alertaMedicamento, setAlertaMedicamento] = useState(false);
  const [alertaWhatsapp, setAlertaWhatsapp] = useState(false);

  // Controle do Autocomplete
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredMedicamentos, setFilteredMedicamentos] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Loadingzinho visual

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erros, setErros] = useState({});
  const wrapperRef = useRef(null);

  // Lógica de Busca no Backend (Debounce)
  const debouncedFilter = useMemo(
    () =>
      debounce(async (value) => {
        if (!value || value.length < 3) {
          setFilteredMedicamentos([]);
          setIsSearching(false);
          return;
        }

        try {
          setIsSearching(true);
          // Chama a rota que criamos no backend
          const response = await apiFetch(`/medicamentos/catalogo?nome=${value}`);
          if (response.ok) {
            const data = await response.json();
            setFilteredMedicamentos(data);
          }
        } catch (error) {
          console.error("Erro ao buscar no catálogo:", error);
        } finally {
          setIsSearching(false);
        }
      }, 500), // 500ms de espera para não sobrecarregar
    []
  );

  useEffect(() => {
    return () => {
      debouncedFilter.cancel && debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const handleNomeChange = (e) => {
    const nome = e.target.value;
    setNomeMedicamento(nome);
    setErros((prev) => ({ ...prev, nomeMedicamento: "" }));
    
    if (nome.length >= 3) {
        setShowDropdown(true);
        setIsSearching(true);
        debouncedFilter(nome);
    } else {
        setShowDropdown(false);
        setFilteredMedicamentos([]);
    }
  };

  const handleSelectMedicamento = (m) => {
    setNomeMedicamento(m.nomeMedicamento);
    setShowDropdown(false);
    setFilteredMedicamentos([]);
    setErros((prev) => ({ ...prev, nomeMedicamento: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErros({});

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

    try {
      const medicamentoSalvo = {
        nome: nomeMedicamento,
        dosagem: Number(dosagem),
        frequencia: Number(frequencia),
        quantidade: Number(qtdUso),
        data_inicio: "",
        periodo : Number(qtdDiasTratamento),
        consumido: false,
        horario: new Date().toTimeString()
      };
      
      const validacaoMedicamento = onMedicamentoSalvo(medicamentoSalvo);
      if (validacaoMedicamento) {
        addMedicamentoReceita(medicamentoSalvo);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar novo medicamento:", error);
      alert("Falha ao salvar o novo medicamento.");
      setIsSubmitting(false);
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
          {/* CAMPO MEDICAMENTO COM AUTOCOMPLETE DO CATÁLOGO */}
          <FormGroup style={{ position: "relative" }} ref={wrapperRef}>
            <Label htmlFor="nomeMedicamento">Medicamento:</Label>
            <InputField
              type="text"
              id="nomeMedicamento"
              name="nomeMedicamento"
              placeholder="Digite para buscar no catálogo..."
              value={nomeMedicamento}
              autoComplete="off"
              onChange={handleNomeChange}
              onBlur={() => {
                // Pequeno delay para permitir o clique na lista
                setTimeout(() => setShowDropdown(false), 200);
              }}
            />

            {erros.nomeMedicamento && (
              <ErrorMessage>{erros.nomeMedicamento}</ErrorMessage>
            )}

            {/* Dropdown de sugestões do Backend */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 50,
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  maxHeight: 180,
                  overflowY: "auto",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  color: "#000",
                }}
              >
                {isSearching && filteredMedicamentos.length === 0 && (
                     <div style={{ padding: "8px 10px", color: "#999" }}>Buscando...</div>
                )}

                {!isSearching && filteredMedicamentos.length === 0 && nomeMedicamento.length >= 3 && (
                     <div style={{ padding: "8px 10px", color: "#999" }}>Nenhum medicamento encontrado.</div>
                )}

                {filteredMedicamentos.map((m) => (
                  <div
                    key={m.id}
                    onMouseDown={(ev) => ev.preventDefault()} 
                    onClick={() => handleSelectMedicamento(m)}
                    style={{
                      padding: "8px 10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    {m.nomeMedicamento}
                  </div>
                ))}
              </div>
            )}
          </FormGroup>

          {/* RESTANTE DO FORMULÁRIO (Igual ao original) */}
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
                setErros((prev) => ({ ...prev, dosagem: "" }));
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
                setErros((prev) => ({ ...prev, frequencia: "" }));
              }}
            >
              <option value="">--</option>
              <option value="1">De 2 em 2 horas</option>
              <option value="2">De 4 em 4 horas</option>
              <option value="3">De 6 em 6 horas</option>
              <option value="4">De 8 em 8 horas</option>
              <option value="5">Uma vez ao dia</option>
              <option value="6">Uma vez na semana</option>
            </Select>
            {erros.frequencia && (
              <ErrorMessage>{erros.frequencia}</ErrorMessage>
            )}
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
                setErros((prev) => ({ ...prev, qtdUso: "" }));
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
                setErros((prev) => ({ ...prev, qtdDiasTratamento: "" }));
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
                  setErros((prev) => ({ ...prev, qtdDiasTratamento: "" }));
                }}
              />
              {erros.qtdDiasTratamento && (
                <ErrorMessage>{erros.qtdDiasTratamento}</ErrorMessage>
              )}
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

          <FormGroup>
            <MyButton
              type="submit"
              disabled={isSubmitting}
              style={{ marginTop: "15px" }}
            >
              {isSubmitting ? "Salvando..." : "Salvar e Adicionar"}
            </MyButton>
          </FormGroup>
        </FormContainer>
      </ModalWrapper>
    </OverlayContainer>
  );
};