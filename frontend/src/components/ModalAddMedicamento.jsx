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
  const { medicamentos, buscaMedicamentos, addMedicamentoReceita } = useMedicamentoContext();

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredMedicamentos, setFilteredMedicamentos] = useState(
    medicamentos || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erros, setErros] = useState({});
  const wrapperRef = useRef(null);

  useEffect(() => {
    buscaMedicamentos();
  }, []);

  useEffect(() => {
    setFilteredMedicamentos(medicamentos || []);
  }, [medicamentos]);

  const debouncedFilter = useMemo(
    () =>
      debounce((value) => {
        const list = medicamentos || [];
        const filtered = value
          ? list.filter((m) => {
              return m.nomeMedicamento
                .toLowerCase()
                .includes(value.toLowerCase());
            })
          : list;
        setFilteredMedicamentos(filtered);
      }, 300),
    [medicamentos]
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
    setShowDropdown(true);
    console.log("Input nomeMedicamento mudou para:", nome);
    debouncedFilter(nome);
  };

  const handleSelectMedicamento = (m) => {
    setNomeMedicamento(m.nomeMedicamento);  
    setShowDropdown(false);
    setErros((prev) => ({ ...prev, nomeMedicamento: "" }));
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
    if (
      tipoUso === "temporario" &&
      (!qtdDiasTratamento || Number(qtdDiasTratamento) <= 0)
    ) {
      newErros.qtdDiasTratamento =
        "Para uso temporário, a quantidade de dias é obrigatória.";
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
          {/* CAMPO MEDICAMENTO */}
          <FormGroup style={{ position: "relative" }} ref={wrapperRef}>
            <Label htmlFor="nomeMedicamento">Medicamento:</Label>
            <InputField
              type="text"
              id="nomeMedicamento"
              name="nomeMedicamento"
              placeholder="Digite ou selecione..."
              value={nomeMedicamento}
              autoComplete="off"
              onChange={handleNomeChange}
              onFocus={() => {
                setShowDropdown(true);
                debouncedFilter("");
              }}
              onBlur={() => {
                setTimeout(() => setShowDropdown(false), 150);
              }}
            />

            {erros.nomeMedicamento && (
              <ErrorMessage>{erros.nomeMedicamento}</ErrorMessage>
            )}

            {/* Dropdown de sugestões */}
            {showDropdown &&
              filteredMedicamentos &&
              filteredMedicamentos.length > 0 && (
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
                  {filteredMedicamentos.map((m) => (
                    <div
                      key={m.id || m.nomeMedicamento}
                      onMouseDown={(ev) => ev.preventDefault()} // evita perda de foco antes do click
                      onClick={() => handleSelectMedicamento(m)}
                      style={{
                        padding: "8px 10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {m.nomeMedicamento}
                    </div>
                  ))}
                </div>
              )}
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
                setErros((prev) => ({ ...prev, dosagem: "" }));
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
                setErros((prev) => ({ ...prev, qtdUso: "" }));
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
                  setErros((prev) => ({ ...prev, qtdDiasTratamento: "" }));
                }}
              />
              {erros.qtdDiasTratamento && (
                <ErrorMessage>{erros.qtdDiasTratamento}</ErrorMessage>
              )}
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
