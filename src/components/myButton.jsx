import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => (props.$primary ? "#2194CA" : "turquoise")};
  color: ${(props) => (props.$primary ? "white" : "#FFFFFF")};
  display: flex;
  font-family: "Nunito", sans-serif;
  font-weight: 200;
  font-optical-sizing: auto;
  font-size: 16px;
  flex-direction: column;
  width: 200px;
  height: 35px;
  margin: 25px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0.25em 1em;
  border: 2px solid #2194ca;
  border-radius: 7px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => (props.$primary ? "#2194CA" : "turquoise")};
    color: ${(props) => (props.$primary ? "white" : "#FFFFFF")};
    border-color: ${(props) => (props.$primary ? "#2194CA" : "turquoise")};
  }

  &:focus {
    background: ${(props) => (props.$primary ? "#386CA8" : "dark blue")};
    border-color: ${(props) => (props.$primary ? "#386CA8" : "dark blue")};
    color: white;
    outline: none;
    box-shadow: none;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
`;

export function MyButton({ children, ...props }) {
  return (
    <Button $primary {...props}>
      {children}
    </Button>
  );
}
