import styled from "styled-components";

const StyledFooter = styled.footer`
  background-color: #1a324e;
  color: white;
  text-align: center;
  width: 100%;
  height: 50px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function Footer() {
  return <StyledFooter>Todos os direitos reservados</StyledFooter>;
}
