import styled from "styled-components";

export const FormContainer = styled.form`
  font-family: "Nunito", sans-serif;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  font-size: 16px;
  justify-content: center;
  align-items: center;
`;

export const InputField = styled.input`
  width: 200px;
  height: 35px;
  box-sizing: border-box;
  margin-bottom: 0.7em;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
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
  font-size: 0.8rem;
  margin-top: -0.8rem;
  margin-bottom: 1rem;
`;
