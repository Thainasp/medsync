import styled from "styled-components";

const StyledHeader = styled.div`
  height: 85px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 7% 0;
`;

export function Header() {
  return (
    <StyledHeader> 
        <img src="./public/assets/images/logoComTexto.svg" alt="logo Medsync" />
    </StyledHeader>
  )
}
