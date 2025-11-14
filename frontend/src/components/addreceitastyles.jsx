import styled, { css } from "styled-components";
// Importa componentes de formulário que você tem no seu sistema
import {
    FormGroup,
    InputField,
    Select,
    Legend,
    FormContainer,
} from "./forms"; // Assumindo que 'forms' está no mesmo nível ou acessível

// Dimensão fixa como no exemplo de referência
const FIXED_WIDTH = "230px";

// Componentes de Formulário Estilizados
// FormContainer (para garantir o alinhamento central)
export const ReceitaFormContainer = styled(FormContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

// InputField (para garantir a largura fixa)
export const ReceitaInputField = styled(InputField)`
    width: ${FIXED_WIDTH};
    max-width: 100%;
`;

// Select (para garantir a largura fixa)
export const ReceitaSelect = styled(Select)`
    width: ${FIXED_WIDTH};
    max-width: 100%;
    height: 40px; /* Adicionado para consistência visual */
`;

// TextAreaField
export const TextAreaField = styled(ReceitaInputField).attrs({ as: "textarea" })`
    height: 80px;
    resize: vertical;
`;

// Container para os itens de uso (Contínuo/Temporário)
export const RadioGroupContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: ${FIXED_WIDTH};
    max-width: 100%;
    margin-bottom: 15px;
`;

// Agrupamento para Label e Input de Radio
export const RadioLabelGroup = styled.label`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    cursor: pointer;
    font-size: 14px;
    color: #333;

    input[type="radio"] {
        margin-right: 8px;
        /* Estilização básica para o radio button */
        appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid #5a5a5a;
        border-radius: 50%;
        background-color: #fff;
        position: relative;
        top: 0;

        &:checked {
            border-color: #3498db;
            background-color: #3498db;
        }

        &:checked::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: white;
        }
    }
`;

// Lista de Medicamentos Adicionados (em Adicionar Receita)
export const ListaMedicamentos = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 20px;
    width: ${FIXED_WIDTH};
    max-width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const ItemMedicamento = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px dashed #eee;
    font-size: 14px;
    color: #333;

    &:last-child {
        border-bottom: none;
    }
`;

// Ícone de Lixo (usado no ItemMedicamento)
export const DeleteButton = styled.button`
    background: none;
    border: none;
    color: #c0392b;
    cursor: pointer;
    padding: 0 5px;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

// Componente para Checkbox
export const CheckboxLabelGroup = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    padding: 5px 0;
    width: ${FIXED_WIDTH};
    max-width: 100%;
    box-sizing: border-box;

    input[type="checkbox"] {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #5a5a5a;
        border-radius: 4px;
        margin-right: 10px;
        position: relative;
        cursor: pointer;
        flex-shrink: 0;

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
            font-size: 12px;
            font-weight: bold;
        }
    }
`;

// Ícone de Lixo SVG para o botão de exclusão
export const TrashIconComponent = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="18px"
        height="18px"
        {...props}
    >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
    </svg>
);