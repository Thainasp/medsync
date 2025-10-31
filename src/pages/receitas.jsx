import React, { useState } from "react";
import styled, { css } from "styled-components"; 

// Componentes Reutilizados
import { TelaBase } from "../components/telaBase";
import { TextoImportante } from "../components/TextoImportante";
import { QuadroFundo } from "../components/quadroFundo"; // O quadrado azul de fundo
// import { MyButton } from "../components/myButton"; 

// --- Dados de Receita de Exemplo (Simulação) ---
const receitasMock = [
    { 
        id: 'r1', 
        nome: 'Receita dra maria', 
        data: '23/08/2025', 
        obs: 'Receita de gripe',
        medicamentos: [{nome: 'Paracetamol 500mg (2x ao dia)'}, {nome: 'Amoxicilina 500mg (3x ao dia)'}]
    },
    { 
        id: 'r2', 
        nome: 'Receita gastro', 
        data: '23/08/2025', 
        obs: 'Acompanhar por 7 dias.', 
        medicamentos: [{nome: 'Omeprazol 20mg (1x ao dia antes do café)'}]
    },
    { 
        id: 'r3', 
        nome: 'Receita dermatológica', 
        data: '01/09/2025', 
        obs: 'Para alergia sazonal', 
        medicamentos: [{nome: 'Loratadina 10mg'}, {nome: 'Creme de Hidrocortisona (uso tópico)'}]
    },
];

// --- 1. Estilos Específicos da Página (MANTIDOS) ---

const PageContainer = styled.div`
    width: 100%;
    padding: 20px 0;
`;

const ListaContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px; 
    padding: 0 10px;
    max-width: 400px; 
    margin: 0 auto;
`;

// --- 2. Componentes de Pesquisa (MANTIDOS) ---

const STRONG_SHADOW = '0 8px 15px rgba(0, 0, 0, 0.25)'; 

const SearchContainer = styled(QuadroFundo)`
    display: block; 
    padding: 8px 15px; 
    margin-bottom: 30px; 
    max-width: 400px; 
    margin: 0 auto 30px auto; 
    background-color: white; 
    box-shadow: ${STRONG_SHADOW}; 
    border-radius: 10px; 
    border: 1px solid #eee; 
    width: 90%; 
    box-sizing: border-box; 
`;

const SEARCH_ICON_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#888">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
</svg>
`);

const SearchInput = styled.input`
    width: 100%; 
    box-sizing: border-box; 
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
    color: #333; 
    padding: 0 0 0 30px; 
    background-image: url("data:image/svg+xml;charset=utf8,${SEARCH_ICON_SVG}");
    background-repeat: no-repeat;
    background-position: left center; 
    background-size: 20px 20px; 
    
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: #888;
    }
`;

// --- 3. Componente de Item da Receita - REFATORADO (Adição dos Ícones de Ação) ---

// Componente para o ícone de seta (MANTIDO)
const ArrowIcon = styled.span`
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 8px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid #333; 
    
    transition: transform 0.2s ease-in-out;
    
    ${props => props.$isExpanded && css`
        transform: rotate(90deg); 
    `}
`;

const RecipeHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start; /* Ajustado para alinhar bem o texto e a barra de ações */
    padding: 10px 15px;
    cursor: pointer; 
    width: 100%;
    box-sizing: border-box;
`;

const RecipeDetails = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const RecipeTitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: #333;
    display: flex;
    align-items: center;
`;

const RecipeInfo = styled.p`
    font-size: 14px;
    margin: 0;
    color: #555;
`;

const AdditionalDetails = styled.div`
    padding: 5px 15px 15px;
    border-top: 1px solid #000000ff;
    margin-top: 1px; 
`;

const MedicationList = styled.ul`
    list-style-type: disc;
    padding-left: 20px;
    margin-top: 5px;
    margin-bottom: 0;
`;

const MedicationItem = styled.li`
    font-size: 14px;
    color: #2c3e50;
    margin-top: 4px;
`;

// **NOVO CONTAINER PARA AGRUPAR OS ÍCONES DE AÇÃO**
const ActionIconsContainer = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px; /* Espaço entre o lápis e a lixeira */
    flex-shrink: 0;
    margin-top: 3px; /* Pequeno ajuste de alinhamento vertical */
`;

// **ESTILO COMUM PARA OS BOTÕES DE ÍCONE**
const IconActionBase = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    flex-shrink: 0;
    
    svg {
        width: 20px;
        height: 20px;
    }
`;

// **Botão de Excluir (Agora usa IconActionBase)**
const DeleteButton = styled(IconActionBase)`
    color: #c0392b; /* Vermelho para exclusão */
`;

// **Botão de Editar (NOVO)**
const EditButton = styled(IconActionBase)`
    color: #3498db; /* Azul para edição */
`;

// Ícone de Lixeira (MANTIDO)
const TrashIconComponent = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
    >
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
    </svg>
); 

// **Ícone de Lápis (NOVO COMPONENTE)**
const PencilIconComponent = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
    >
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
);

const ItemReceita = ({ receita, onDelete, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleToggleDetails = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); 
        onDelete(receita.id);
    };
    
    // **NOVA FUNÇÃO DE CLIQUE PARA EDIÇÃO**
    const handleEditClick = (e) => {
        e.stopPropagation(); // Impede que o clique no botão ative o toggle
        onEdit(receita.id);
    };
    
    return (
        <QuadroFundo style={{ padding: 0 }}>
            <RecipeHeader onClick={handleToggleDetails} aria-expanded={isExpanded} role="button">
                <RecipeDetails>
                    <RecipeTitle>
                        {receita.nome}
                        <ArrowIcon $isExpanded={isExpanded} /> 
                    </RecipeTitle>
                    <RecipeInfo>
                        Data: {receita.data}
                    </RecipeInfo>
                </RecipeDetails>
                
                {/* **Contêiner para os Ícones de Ação** */}
                <ActionIconsContainer>
                    <EditButton 
                        onClick={handleEditClick} 
                        aria-label={`Editar receita ${receita.nome}`}
                    >
                        <PencilIconComponent />
                    </EditButton>
                    
                    <DeleteButton 
                        onClick={handleDeleteClick} 
                        aria-label={`Excluir receita ${receita.nome}`}
                    >
                        <TrashIconComponent />
                    </DeleteButton>
                </ActionIconsContainer>
            </RecipeHeader>

            {isExpanded && (
                <AdditionalDetails>
                    <RecipeInfo>
                        **Observação: {receita.obs || 'Nenhuma observação'}
                    </RecipeInfo>
                    
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '10px 0 5px 0', color: '#333' }}>
                        Medicamentos:
                    </p>
                    
                    <MedicationList>
                        {receita.medicamentos.map((med, index) => (
                            <MedicationItem key={index}>
                                {med.nome}
                            </MedicationItem>
                        ))}
                    </MedicationList>
                </AdditionalDetails>
            )}
        </QuadroFundo>
    );
};


// --- 4. Componente Principal: Receitas - REFATORADO (passando onEdit) ---

const Receitas = () => {
    const [receitas, setReceitas] = useState(receitasMock); 
    const [searchTerm, setSearchTerm] = useState(''); 

    const filteredReceitas = receitas.filter(receita => 
        receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receita.obs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receita.medicamentos.some(med => med.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDeleteReceita = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta receita?")) {
            console.log(`Receita ID: ${id} excluída (SIMULAÇÃO API DELETE)`);
           setReceitas(receitas.filter(r => r.id !== id));
        }
    };
    
    // **FUNÇÃO DE EDIÇÃO ATUALIZADA**
    const handleEditReceita = (id) => {
        // Simulação de navegação para a página de edição
        const editUrl = `/editarReceita/${id}`; 
        console.log(`[NAVIGATE] Redirecionando para: ${editUrl}`);
        
        // Se estivesse em um projeto real com React Router:
        // navigate(editUrl); 
        
        // Simulação de redirecionamento:
        // window.location.href = editUrl; 
    };

    return (
        <TelaBase>
            <PageContainer>
                
                <TextoImportante style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Receitas e medicamentos
                </TextoImportante>

                {/* Barra de Pesquisa */}
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="Pesquise uma receita ou medicamento"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchContainer>
                
                {/* Lista de Receitas */}
                <ListaContainer>
                    {filteredReceitas.length > 0 ? (
                        filteredReceitas.map(receita => (
                            <ItemReceita 
                                key={receita.id}
                                receita={receita}
                                onDelete={handleDeleteReceita}
                                // **Agora passando a função de edição para o ItemReceita**
                                onEdit={handleEditReceita}
                            />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#777' }}>
                            Nenhuma receita encontrada.
                        </p>
                    )}
                </ListaContainer>
                
            </PageContainer>
        </TelaBase>
    );
};

export { Receitas };