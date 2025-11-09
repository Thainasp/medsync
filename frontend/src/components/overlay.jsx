import styled from "styled-components";

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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  `;

  export const OverlayTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

export const OverlayText = styled.p`
  font-size: 16px;
  margin-bottom: 25px;
`;

export const OverlayIcon = styled.img`
  width: 60px;
  height: 60px;
`;