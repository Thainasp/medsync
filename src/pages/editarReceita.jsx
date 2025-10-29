import React from "react";
import { ReceitaForm } from '../components/receitaForm'; // Importa o componente base
// Importe a sua API aqui (ex: import api from '../services/api';)

// Recebe a receita que deve ser preenchida
const EditarReceita = ({ receitaParaEditar }) => {

    // 1. Função de Submissão para Edição (PUT/PATCH)
    const handleUpdate = (formData) => {
        
        // O ID é obrigatório para atualizar
        if (!formData.id) {
            console.error("ID da receita não encontrado para atualização!");
            alert("Erro: ID de receita ausente.");
            return;
        }

        const receitaId = formData.id;
        const dataToUpdate = formData;
        
        console.log(`Receita ID: ${receitaId} a ser atualizada (Dados):`, dataToUpdate);

        // --- CONEXÃO COM A API PARA EDIÇÃO ---
        /*
        // Normalmente usamos PUT ou PATCH com o ID na URL
        api.put(`/receitas/${receitaId}`, dataToUpdate) // ou api.patch
            .then(response => {
                alert("Receita atualizada com sucesso!");
                // Exemplo: Retornar para a página de detalhes
            })
            .catch(error => {
                console.error("Erro ao atualizar receita:", error);
                alert("Falha ao atualizar receita.");
            });
        */
        
        console.log("-> Simulação: Chamada API PUT/PATCH comentada.");
    };

    // 2. Renderiza o formulário base, passando a receita e a função de update
    return (
        <ReceitaForm 
            initialData={receitaParaEditar} // Passa os dados para preencher
            onSubmit={handleUpdate}
            title="Editando Receita"
            buttonText="Salvar Alterações"
        />
    );
};

export { EditarReceita };