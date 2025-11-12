import styled from "styled-components";

export const FormContainer = styled.form`
  font-family: "Nunito", sans-serif;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  margin-bottom: 0rem;
  `;

export const Title = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 1.7rem;
  margin: 0.5rem;
  font-weight: normal;
  `;

export const InputField = styled.input`
  width: 200px;
  height: 35px;
  box-sizing: border-box;
  margin: 0 25px;
  margin-bottom: 0.7em;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  margin-bottom: 1.3rem;
  `;

export const Label = styled.label`
  font-family: "Nunito", sans-serif;
  font-weight: 20;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const Legend = styled.legend`
  font-family: "Nunito", sans-serif;
  font-weight: 20;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const ErrorMessage = styled.p`
  color: red;
  display: block;
  white-space: pre-wrap;
  font-size: 0.8rem;
  margin-top: -0.8rem;
  margin-bottom: 1rem;
  `;


export const DivCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;`

export const InputCheckbox = styled.input`
  width: 15px;
  height: 15px;
  margin: 0;
  padding: 0;
  margin-left: 30px;
  margin-right: 10px;
  `;

export const Paragraph = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  marging-bottom: 1rem;`

export const StyledDivLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 4rem;

  a {
    color: #000000ff;
    text-decoration: none;
    font-family: 'Nunito', sans-serif;
    
    &:hover,
    &:focus,
    &:active {
    text-decoration: none;
    color: #2194CA;
  }

  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;

export const Select = styled.select`
  width: 200px;
  height: 35px;
  box-sizing: border-box;
  margin: 0 25px;
  margin-bottom: 0.7em;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  margin-bottom: 1.3rem;
`;

export const DeleteButton = styled.button`
  background-color: transparent;
  color: #888; /* Cor cinza para ser discreto */
  border: 1px solid #ccc;
  padding: 10px 20px; /* O padding define o tamanho */
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease-in-out;
  
  width: auto; /* O botão terá o tamanho do seu conteúdo */
  display: block; /* Necessário para centralizar com margem */
  margin-top: 10px; /* Espaço acima */
  margin-left: auto; /* Centraliza o botão */
  margin-right: auto; /* Centraliza o botão */

  &:hover {
    background-color: #dc3545; /* Vermelho no hover */
    color: #fff; /* Texto branco para contraste */
    border-color: #dc3545;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    color: #6c757d;
  }
`;
