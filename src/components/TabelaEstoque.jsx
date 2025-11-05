import React from 'react';

// Ícone da lixeira (mantido)
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

// --- NOVO ---
// Ícone de Edição (Lápis)
const EditIconComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="18px"
    height="18px"
    {...props}
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);
// --- FIM NOVO ---


export const TABLE_CSS = `
    /* ... (Estilos do table-wrapper e styled-table mantidos) ... */
    .table-wrapper {
        max-width: 600px;
        margin: 2rem auto;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        border-radius: 8px;
        overflow: hidden; 
    }
    .styled-table {
        width: 100%;
        border-collapse: collapse;
        font-family: "Nunito", sans-serif;
        font-size: 16px;
    }
    .styled-table th, .styled-table td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    .styled-table th {
        background-color: #2194CA;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
    }
    .styled-table tbody tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    .styled-table tbody tr:hover {
        background-color: #e0e0e0;
        cursor: pointer;
    }

    /* --- NOVAS CLASSES PARA O BOTÃO DE EDITAR --- */
    .edit-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #2194CA; /* Cor azul do header */
        transition: color 0.2s ease;
        padding: 0;
        vertical-align: middle; /* Alinha os ícones */
    }

    .edit-button:hover svg {
        color: #1a78a1; /* Azul mais escuro */
    }

    .edit-icon {
        vertical-align: middle;
        color: #2194CA;
    }
    /* --- FIM NOVO --- */


    /* Corresponde a DeleteButton (Usado como classe .delete-button) */
    .delete-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #f44336;
        transition: color 0.2s ease;
        padding: 0;
        margin-left: 10px; /* NOVO: Adiciona espaço entre os botões */
    }

    .delete-button:hover svg {
        color: #d32f2f;
    }

    .delete-icon {
        vertical-align: middle;
        color: #f44336;
    }
`;

// Exporta um objeto de utilidade para facilitar o uso
export const TableStyles = {
    // Componentes SVG com a classe aplicada
    TrashIcon: (props) => <TrashIconComponent className="delete-icon" {...props} />,
    EditIcon: (props) => <EditIconComponent className="edit-icon" {...props} />, // NOVO
    
    // A string CSS
    CSS: TABLE_CSS,
    
    // Classes de utilidade para o JSX
    WrapperClass: "table-wrapper",
    TableClass: "styled-table",
    DeleteButtonClass: "delete-button",
    EditButtonClass: "edit-button", // NOVO
};

// --- COMPONENTE ALTERADO ---
// Aceita 'onEdit' como nova prop
export function TabelaEstoque({ data, onDelete, onEdit }) {
  
  if (!data || data.length === 0) {
    return <p>Nenhum item no estoque.</p>;
  }

  return (
    <div className={TableStyles.WrapperClass}>
      
      <style>{TableStyles.CSS}</style>

      <table className={TableStyles.TableClass}>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Quantidade</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.quantidade}</td>
              <td>
                {/* NOVO: Botão de Edição */}
                <button
                  className={TableStyles.EditButtonClass}
                  onClick={() => onEdit(item.id)} // Chama a função onEdit
                >
                  <TableStyles.EditIcon />
                </button>
                
                {/* Botão de exclusão (agora com espaço) */}
                <button
                  className={TableStyles.DeleteButtonClass}
                  onClick={() => onDelete(item.id)}
                >
                  <TableStyles.TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}