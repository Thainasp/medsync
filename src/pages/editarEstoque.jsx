import React, { useState } from "react";

// Importações de componentes que seguem o padrão do componente modelo
import { QuadroFundo } from "../components/quadroFundo";
import { TextoImportante } from "../components/TextoImportante";
import { MyButton } from "../components/myButton";
import { TelaBase } from "../components/telaBase";
import {
  FormContainer,
  Label,
  InputField,
  FormGroup,
} from "../components/forms";

// Lista de medicamentos de exemplo para o dropdown (mantida)
const listaMedicamentos = [
  { id: 1, nome: "Paracetamol 500mg" },
  { id: 2, nome: "Amoxicilina 250mg" },
  { id: 3, nome: "Dorflex" },
  { id: 4, nome: "Ibuprofeno 600mg" },
];

// Opções para o dropdown de Ação
const listaAcoes = [
  { valor: "adicionar", nome: "Adicionar ao Estoque" },
  { valor: "subtrair", nome: "Subtrair do Estoque" },
];

const EditarEstoque = () => {
  // 1. Estado para o medicamento selecionado (Medicamento)
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState("");
  // 2. Estado para a ação (Ação)
  const [acao, setAcao] = useState("");
  // 3. Estado para a quantidade (Quantidade)
  const [quantidade, setQuantidade] = useState(0);

  // Removidos os estados 'dataCompra' e 'quantidadeComprada' não solicitados.

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      medicamento: medicamentoSelecionado,
      acao: acao,
      quantidade: quantidade,
    };
    console.log("Transação de Estoque Registrada:", formData);
    // Lógica para enviar a transação de estoque (adicionar ou subtrair)
  };

  return (
    <TelaBase>
      <QuadroFundo>
        <TextoImportante>Editar medicamento em estoque</TextoImportante>
        <FormContainer onSubmit={handleSubmit}>
          
          {/* 1. Campo: Medicamento (Dropdown/Select) */}
          <FormGroup>
            <Label htmlFor="medicamento">Medicamento:</Label>
            <InputField
              as="select" // Renderiza como <select>
              id="medicamento"
              name="medicamento"
              required
              value={medicamentoSelecionado}
              onChange={(e) => setMedicamentoSelecionado(e.target.value)}
            >
              <option value="" disabled>Selecione um medicamento</option>
              {listaMedicamentos.map((med) => (
                <option key={med.id} value={med.nome}>
                  {med.nome}
                </option>
              ))}
            </InputField>
          </FormGroup>

          {/* 2. Campo: Ação (Dropdown/Select: adicionar, subtrair) */}
          <FormGroup>
            <Label htmlFor="acao">Ação:</Label>
            <InputField
              as="select" // Renderiza como <select>
              id="acao"
              name="acao"
              required
              value={acao}
              onChange={(e) => setAcao(e.target.value)}
            >
              <option value="" disabled>Selecione a Ação</option>
              {listaAcoes.map((item) => (
                <option key={item.valor} value={item.valor}>
                  {item.nome}
                </option>
              ))}
            </InputField>
          </FormGroup>

          {/* 3. Campo: Quantidade (Input Number) */}
          <FormGroup>
            <Label htmlFor="quantidade">Quantidade:</Label>
            <InputField
              type="number"
              id="quantidade"
              name="quantidade"
              required
              min="1" // Garante que a quantidade seja pelo menos 1
              placeholder="Insira a quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))} // Converte para número
            />
          </FormGroup>

          <MyButton type="submit">Registrar Transação</MyButton>
        </FormContainer>
      </QuadroFundo>
    </TelaBase>
  );
};

export {EditarEstoque}; // Mantendo a exportação padrão para consistência