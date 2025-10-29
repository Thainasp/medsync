import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { QuadroFundo } from "./quadroFundo";
import { TextoImportante } from "./TextoImportante";
import { MyButton } from "./myButton";
import { TelaBase } from "./telaBase";


import {
  FormContainer as BaseFormContainer,
  Label,
  InputField as BaseInputField,
  FormGroup,
} from "./forms";

// --- Ícones e Estilos (Mantidos) ---
// (Todos os estilos e o TrashIconComponent são mantidos aqui)

const TrashIconComponent = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        width="18px" 
        height="18px"
        {...props}
    >
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
    </svg>
); 

const listaMedicamentosDisponiveis = [
  { id: 1, nome: "Lamotrigina 5mg" },
  { id: 2, nome: "Ansitec 5mg" },
  { id: 3, nome: "Paracetamol 500mg" },
  { id: 4, nome: "Amoxicilina 250mg" },
];

const FIXED_WIDTH = '280px'; 

const FormContainer = styled(BaseFormContainer)`
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%; 
`;

const InputField = styled(BaseInputField)`
    width: ${FIXED_WIDTH}; 
    max-width: 100%;
`;

const TextAreaField = styled(InputField).attrs({ as: "textarea" })`
    height: 80px; 
    resize: vertical; 
`;

const ListaMedicamentos = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  width: ${FIXED_WIDTH}; 
`;

const ItemMedicamento = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed #ccc; 
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #c0392b; 
  cursor: pointer;
  padding: 0 5px;
  display: flex;
  align-items: center;
`;

const CheckboxGroup = styled(FormGroup)`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  width: ${FIXED_WIDTH}; 
`;

const CustomCheckbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #5a5a5a;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  cursor: pointer;

  &:checked {
    border-color: #3498db;
    background-color: #3498db;
  }

  &:checked::after {
    content: "✓"; 
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: bold;
  }
`;

// --- Componente Principal Reutilizável ---
// Ele recebe:
// - initialData: Dados para preencher (vazio para Add, preenchido para Edit)
// - onSubmit: A função de salvar/atualizar que será passada pelo wrapper
// - title: O título a ser exibido ("Adicionando Receita" ou "Editando Receita")
const ReceitaForm = ({ initialData, onSubmit, title, buttonText }) => {

  // --- Estados do Formulário ---
  const [nomeReceita, setNomeReceita] = useState(initialData?.nomeReceita || "");
  const [dataReceita, setDataReceita] = useState(initialData?.dataReceita || "");
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || "");
  const [alertaVencimento, setAlertaVencimento] = useState(initialData?.alertaVencimento || false);
  const [notificacaoMed, setnotificacaoMed] = useState(initialData?.notificacaoMed || false);
  const [medicamentosReceita, setMedicamentosReceita] = useState(initialData?.medicamentosReceita || []);
  
  const [novoMedicamentoId, setNovoMedicamentoId] = useState("");
  const [mostrarDropdownAdicao, setMostrarDropdownAdicao] = useState(false);

  // --- Efeito para carregar novos initialData (Importante para o modo Edição) ---
  useEffect(() => {
      // Quando 'initialData' muda (por exemplo, ao carregar a receita para edição)
      // Atualiza os estados do formulário
      if (initialData) {
          setNomeReceita(initialData.nomeReceita || "");
          setDataReceita(initialData.dataReceita || "");
          setObservacoes(initialData.observacoes || "");
          setAlertaVencimento(initialData.alertaVencimento || false);
          setnotificacaoMed(initialData.notificacaoMed || false);
          setMedicamentosReceita(initialData.medicamentosReceita || []);
      }
  }, [initialData]);

  // --- Handlers (Mantidos) ---
  const handleAdicionarMedicamento = () => {
    if (novoMedicamentoId) {
      const isDuplicate = medicamentosReceita.some(med => med.id.toString() === novoMedicamentoId);
      
      if (isDuplicate) {
        alert("Este medicamento já foi adicionado à receita.");
        return; 
      }

      const medInfo = listaMedicamentosDisponiveis.find(m => m.id.toString() === novoMedicamentoId);
      
      if (medInfo) {
        setMedicamentosReceita([
          ...medicamentosReceita,
          { id: medInfo.id, nome: medInfo.nome } 
        ]);
        setNovoMedicamentoId(""); 
        setMostrarDropdownAdicao(false); 
      }
    } else {
      setMostrarDropdownAdicao(true); 
    }
  };

  const handleRemoverMedicamento = (id) => {
    setMedicamentosReceita(medicamentosReceita.filter(med => med.id !== id));
  };

  // --- Função de Submissão que chama o prop 'onSubmit' ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Constrói o objeto de dados com os valores atuais
    const formData = {
      // Inclui o ID original se estiver em modo de edição
      id: initialData?.id, 
      nomeReceita,
      dataReceita,
      observacoes,
      medicamentosReceita,
      alertaVencimento,
      notificacaoMed,
    };
    
    // Chama a função de salvar/atualizar passada via prop
    onSubmit(formData);
  };

  return (
    <TelaBase>
      <QuadroFundo>
        <TextoImportante>{title}</TextoImportante>
        
        <FormContainer onSubmit={handleSubmit}>
          
          <FormGroup>
            <InputField
              type="text"
              id="nome-receita"
              name="nome-receita"
              required
              placeholder="Nome da receita *"
              value={nomeReceita}
              onChange={(e) => setNomeReceita(e.target.value)}
            />
          </FormGroup>
          {/* ... (Outros campos do formulário) ... */}
          <FormGroup>
            <InputField
              type="date"
              id="data-receita"
              name="data-receita"
              required
              placeholder="Data receita *"
              value={dataReceita}
              onChange={(e) => setDataReceita(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <TextAreaField 
              id="observacoes"
              name="observacoes"
              placeholder="Observações"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={2}
            />
          </FormGroup>

          {/* Botão Novo medicamento / Dropdown de adição */}
          {mostrarDropdownAdicao && (
            <FormGroup>
              <InputField
                as="select"
                id="novo-medicamento"
                name="novo-medicamento"
                value={novoMedicamentoId}
                onChange={(e) => setNovoMedicamentoId(e.target.value)}
              >
                <option value="" disabled>Selecione um medicamento</option>
                
                {listaMedicamentosDisponiveis
                  .filter(med => !medicamentosReceita.some(r => r.id === med.id))
                  .map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.nome}
                    </option>
                  ))}
              </InputField>
            </FormGroup>
          )}

          <MyButton 
            type="button" 
            onClick={handleAdicionarMedicamento}
          >
            {mostrarDropdownAdicao && novoMedicamentoId ? "Adicionar" : "Novo medicamento"}
          </MyButton>

          {/* Lista de Medicamentos Adicionados */}
          <ListaMedicamentos>
            {medicamentosReceita.map((med) => (
              <ItemMedicamento key={med.id}>
                • {med.nome}
                <DeleteButton 
                  type="button" 
                  onClick={() => handleRemoverMedicamento(med.id)}
                  aria-label={`Remover ${med.nome}`}
                >
                    <TrashIconComponent /> 
                </DeleteButton>
              </ItemMedicamento>
            ))}
          </ListaMedicamentos>

          {/* Checkbox para Alerta de Vencimento */}
          <CheckboxGroup>
            <CustomCheckbox
              id="alerta-vencimento"
              name="alerta-vencimento"
              checked={alertaVencimento}
              onChange={(e) => setAlertaVencimento(e.target.checked)}
            />
            <Label htmlFor="alerta-vencimento">Deseja receber alerta de vencimento de receita?</Label>
          </CheckboxGroup>

        <CheckboxGroup>
            <CustomCheckbox
              id="notificacaoMedicamento"
              name="notificacaoMedicamento"
              checked={notificacaoMed}
              onChange={(e) => setnotificacaoMed(e.target.checked)}
            />
            <Label htmlFor="notificacaoMedicamento">Receber alerta de tomada dos medicamentos dessa receita?</Label>
        </CheckboxGroup>

          {/* Botão de Ação */}
          <MyButton 
            type="submit"
            style={{ marginTop: "20px" }}
          >
            {buttonText}
          </MyButton>

        </FormContainer>
      </QuadroFundo>
    </TelaBase>
  );
};

// Exportamos o componente base para uso interno, mas exportaremos os wrappers para uso externo.
export { ReceitaForm }; 