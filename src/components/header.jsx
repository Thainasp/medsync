import styled from "styled-components";
import { useState } from "react";

const StyledHeader = styled.div`
  height: 85px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10% 0;
`;

const HeaderContainer = styled.div`
  max-height: 45px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 20px;
  font-size: 20px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:hover {
    opacity: ${props => props.$clickable ? '0.7' : '1'};
  }
`;

const HeaderText = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid black;
  margin: 10px 10px 25px 10px;
  width: 60%;
  color: black;
  font-size: 20px;
`;

export function Header({ 
  variant = "default", 
  text = "Texto Padrão",
  onMenuClick 
}) {
  if (variant === "default") {
    return (
      <StyledHeader> 
        <img src="./public/assets/images/logoComTexto.svg" alt="logo Medsync" />
      </StyledHeader>
    );
  }
  if (variant === "alt") {
    return (
      <HeaderContainer> 
        <HeaderContent>
          <HeaderImage src="./public/assets/images/logoSimples.svg" alt="logo Medsync" />
          <HeaderText>{text}</HeaderText>
          <HeaderImage 
            src="./public/assets/images/sanduiche.png" 
            alt="Abrir menu" 
            $clickable={true}
            onClick={onMenuClick}
          />
        </HeaderContent>
        <Divider /> 
      </HeaderContainer>
    );
  }
  return (
    <StyledHeader> 
      <img src="./public/assets/images/logoComTexto.svg" alt="logo Medsync" />
    </StyledHeader>
  );
}