import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.$primary ? "#2194CA" : "turquoise"};
  color: ${props => props.$primary ? "white" : "#FFFFFF"};

  font-family: 'Nunito', sans-serif;
  font-weight: 200;
  font-optical-sizing: auto;
  font-size: 16px;
  width: 150px;
  height: 35px;
  margin: 2.5em;
  padding: 0.25em 1em;
  border: 2px solid #2194CA;
  border-radius: 3px;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: ${props => props.$primary ? "#2194CA" : "turquoise"};
    color: ${props => props.$primary ? "white" : "#FFFFFF"};
    border-color: ${props => props.$primary ? "#2194CA" : "turquoise"};
  }

  &:focus {
    background: ${props => props.$primary ? "#386CA8" : "dark blue"};
    border-color: ${props => props.$primary ? "#386CA8" : "dark blue"};
    color: white;
    outline: none;
    box-shadow: none;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
`;

export function MyButton({ children }) {
  return (
    <Button $primary>
      {children}
    </Button>
  );
}