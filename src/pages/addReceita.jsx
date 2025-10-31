import React from "react";
import { ReceitaForm } from '../components/receitaForm'; // Importa o componente base
// Importe a sua API aqui (ex: import api from '../services/api';)

const AddReceita = () => {

    // 1. Função de Submissão para Criação (POST)
    const handleSave = (formData) => {
        // Remove o ID, pois é uma criação
        const { id, ...dataToCreate } = formData; 
        
        console.log("Receita a ser criada (Dados):", dataToCreate);

        // --- CONEXÃO COM A API PARA CRIAÇÃO ---
        /*
        api.post('/receitas', dataToCreate)
            .then(response => {
                alert("Receita adicionada com sucesso!");
                // Redirecionar ou limpar o formulário
            })
            .catch(error => {
                console.error("Erro ao adicionar receita:", error);
                alert("Falha ao adicionar receita.");
            });
        */
        
        console.log("-> Simulação: Chamada API POST comentada.");
    };

    // 2. Renderiza o formulário base, passando dados vazios e a função de save
    return (
        <ReceitaForm 
            initialData={{}} // Dados vazios para criação
            onSubmit={handleSave}
            title="Adicionando Receita"
            buttonText="Salvar Receita"
        />
    );
};

export { AddReceita };