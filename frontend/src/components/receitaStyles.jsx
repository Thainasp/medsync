import styled, { css } from "styled-components";
import { QuadroFundo } from "../components/quadroFundo"; // Certifique-se de importar QuadroFundo aqui

const STRONG_SHADOW = '0 8px 15px rgba(0, 0, 0, 0.25)';

const SEARCH_ICON_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#888">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
</svg>
`);

export const IconActionBase = styled.button`
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


export const PageContainer = styled.div`
    width: 100%;
    padding: 20px 0;
`;

export const ListaContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px; 
    padding: 0 10px;
    max-width: 400px; 
    margin: 0 auto;
`;


export const SearchContainer = styled(QuadroFundo)`
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

export const SearchInput = styled.input`
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


export const ArrowIcon = styled.span`
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

export const RecipeHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 15px;
    cursor: pointer; 
    width: 100%;
    box-sizing: border-box;
`;

export const RecipeDetails = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const RecipeTitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: #333;
    display: flex;
    align-items: center;
`;

export const RecipeInfo = styled.p`
    font-size: 14px;
    margin: 0;
    color: #555;
`;

export const AdditionalDetails = styled.div`
    padding: 5px 15px 15px;
    border-top: 1px solid #000000ff;
    margin-top: 1px; 
`;

export const MedicationList = styled.ul`
    list-style-type: disc;
    padding-left: 20px;
    margin-top: 5px;
    margin-bottom: 0;
`;

export const MedicationContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    span {
        flex-grow: 1;
        margin-right: 8px; 
    }
`;

export const MedicationItem = styled.li`
    font-size: 14px;
    color: #2c3e50;
    margin-top: 4px;
    display: flex; 
    align-items: center;
    justify-content: space-between;
`;

export const ActionIconsContainer = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-shrink: 0;
    margin-top: 3px;
`;

export const DeleteButton = styled(IconActionBase)`
    color: #c0392b;
`;

export const EditButton = styled(IconActionBase)`
    color: #3498db;
`;

export const EditMedButton = styled(IconActionBase)`
    color: #3498db; 
    padding: 0; 
    margin-left: 5px;
    
    svg {
        width: 16px; 
        height: 16px;
    }
`;


export const TrashIconComponent = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
    >
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
    </svg>
); 

export const PencilIconComponent = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
    >
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
);