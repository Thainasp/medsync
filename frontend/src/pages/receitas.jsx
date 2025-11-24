import React, { use, useState, useEffect} from "react";


import { TelaBase } from "../components/telaBase";
import { TextoImportante } from "../components/TextoImportante";
import { QuadroFundo } from "../components/quadroFundo";

import {
    OverlayContainer,
    OverlayTitle,
    OverlayContent,
    ConfirmButton,
    CancelButton,
    OverlayText,
} from "../components/overlay"; 

import {
    PageContainer,
    ListaContainer,
    SearchContainer,
    SearchInput,
    ArrowIcon,
    RecipeHeader,
    RecipeDetails,
    RecipeTitle,
    RecipeInfo,
    AdditionalDetails,
    MedicationList,
    MedicationItem,
    MedicationContent, 
    ActionIconsContainer,
    DeleteButton,
    EditButton,
    EditMedButton, 
    TrashIconComponent,
    PencilIconComponent
} from "../components/receitaStyles"; 

import { useReceitaContext } from "../context/ReceitaContext";
import { useMedicamentoContext } from "../context/MedicamentoContext";

// --- Componente ItemReceita  ---

const ItemReceita = ({ receita, onDelete, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const [medicamentos, setMedicamentos] = useState([]);
    const { buscarMedicamentosByReceitaId } = useMedicamentoContext();

    const handleFetchMedicamentos = async () => {
        const meds = await buscarMedicamentosByReceitaId(receita.idReceita);
        console.log("Medicamentos buscados para receita ID", receita.idReceita, ":", meds);

        const medsArray = Array.isArray(meds) ? meds : (meds ? [meds] : []);
        setMedicamentos(medsArray);
    };

    useEffect(() => {
        if (isExpanded && medicamentos.length === 0) {
            handleFetchMedicamentos();
        }
    }, [isExpanded]);

    const handleToggleDetails = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); 
        onDelete(receita.id, receita.nome);
    };
    
    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(receita.id);
    };
    
    const handleEditMedClick = (e, nomeMedicamento) => {
        e.stopPropagation();    
        const editMedUrl = `/editarMed?receitaId=${receita.id}&medNome=${encodeURIComponent(nomeMedicamento)}`;
        
        console.log(`[NAVIGATE] Redirecionando para: ${editMedUrl}`);
    }; 
    useEffect(() => {
        console.log("Receita atual:", receita);
    }, [receita]);
    
    return (

        <QuadroFundo style={{ padding: 0 }}>
            <RecipeHeader onClick={handleToggleDetails} aria-expanded={isExpanded} role="button">
                <RecipeDetails>
                    <RecipeTitle>
                        {receita.nomeReceita}
                        <ArrowIcon $isExpanded={isExpanded} /> 
                    </RecipeTitle>
                    <RecipeInfo>
                        Data: {receita.data_emissao}
                    </RecipeInfo>
                </RecipeDetails>
                
                <ActionIconsContainer>
                    <EditButton 
                        onClick={handleEditClick} 
                        aria-label={`Editar receita ${receita.nomeReceita}`}
                    >
                        <PencilIconComponent />
                    </EditButton>
                    
                    <DeleteButton 
                        onClick={handleDeleteClick} 
                        aria-label={`Excluir receita ${receita.nomeReceita}`}
                    >
                        <TrashIconComponent />
                    </DeleteButton>
                </ActionIconsContainer>
            </RecipeHeader>

            {isExpanded && (
                <AdditionalDetails>
                    <RecipeInfo>
                        **Observação: {receita.observacoes || 'Nenhuma observação'}
                    </RecipeInfo>
                    
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '10px 0 5px 0', color: '#333' }}>
                        Medicamentos:
                    </p>
                    
                    <MedicationList>
                        {medicamentos?.map((med, index) => (
                            <MedicationItem key={index}>
                                <MedicationContent>
                                    <span>{med.nome}</span>
                                    <EditMedButton 
                                        onClick={(e) => handleEditMedClick(e, med.nome)} 
                                        aria-label={`Editar medicamento ${med.nome}`}
                                    >
                                        <PencilIconComponent />
                                    </EditMedButton>
                                </MedicationContent>
                            </MedicationItem>
                        ))}
                    </MedicationList>
                </AdditionalDetails>
            )}
        </QuadroFundo>
    );
};



const Receitas = () => {
    const { receitas } = useReceitaContext();
    const [searchTerm, setSearchTerm] = useState(''); 
    
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null); 

    const filteredReceitas =
     receitas.filter(receita => 
        receita.nomeReceita.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receita.observacoes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteReceita = (id, nome) => {
        setRecipeToDelete({ id, nome });
        setShowDeletePopup(true);
    };
    
    const confirmDelete = () => {
        if (recipeToDelete && recipeToDelete.id) {
            console.log(`Receita ID: ${recipeToDelete.id} excluída (SIMULAÇÃO API DELETE)`);
           setReceitas(receitas.filter(r => r.id !== recipeToDelete.id));
        }
        setShowDeletePopup(false);
        setRecipeToDelete(null);
    };
    
    const cancelDelete = () => {
        setShowDeletePopup(false);
        setRecipeToDelete(null);
    };
    
    const handleEditReceita = (id) => {
        const editUrl = `/editarReceita/${id}`; 
        console.log(`[NAVIGATE] Redirecionando para: ${editUrl}`);
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
                        filteredReceitas.reverse().map(receita => (
                            <ItemReceita 
                                key={receita.id}
                                receita={receita}
                                onDelete={handleDeleteReceita} 
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
            
            {/* Componente Pop-up de Confirmação */}
            {showDeletePopup && recipeToDelete && (
                <OverlayContainer>
                    <OverlayContent>
                        <OverlayTitle>
                            Confirmação de Exclusão
                        </OverlayTitle>
                        <OverlayText>
                            Tem certeza que deseja excluir a receita **"{recipeToDelete.nome}"**? Esta ação não pode ser desfeita.
                        </OverlayText>
                        <div>
                            <ConfirmButton onClick={confirmDelete}>
                                Excluir
                            </ConfirmButton>
                            <CancelButton onClick={cancelDelete}>
                                Cancelar
                            </CancelButton>
                        </div>
                    </OverlayContent>
                </OverlayContainer>
            )}
            
        </TelaBase>
    );
};

export { Receitas };