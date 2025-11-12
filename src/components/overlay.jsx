
import styled, { css } from "styled-components"; 

export const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OverlayContent = styled.div`
  width: 90%;
  margin: 0 35px 0 35px;
  max-width: 350px;
  padding: 35px;
  border-radius: 8px;
  background-color: #75A0D1; 
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  z-index: 1001;
`;

export const OverlayTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

export const OverlayText = styled.p`
  font-size: 16px;
  margin-bottom: 25px;
`;

export const PopupButton = styled.button`
    padding: 10px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    min-width: 100px;
    transition: background-color 0.2s;
    width: 100%;           
    max-width: 200px;    
`;

export const ConfirmButton = styled(PopupButton)`
    background-color: #ecf0f1; 
    color: #333;

    &:hover {
        background-color: #c0392b; 
        color: #ecf0f1;
    }
`;

export const CancelButton = styled(PopupButton)`
    background-color: #ecf0f1; 
    color: #333;

    &:hover {
        background-color: #bdc3c7;
    }
`;

export const OverlayIcon = styled.img`
    width: 40px;
    height: 40px;
`;

export const ModalWrapper = styled.div`
  background: #75A0D1;
  color: #fff;
  width: 90%;
  max-width: 500px;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1002;
  position: relative; // Para o botão de fechar
  max-height: 80vh; // Limita a altura
  overflow-y: auto; // Permite scroll se o formulário for longo
`; 