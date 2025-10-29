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


