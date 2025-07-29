import React from 'react';
import styled from 'styled-components';


  const Button = styled.button`
  background: ${props => props.$primary ? "#2194CA" : "turquoise"};
  color: ${props => props.$primary ? "white" : "#FFFFFF"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #2194CA;
  border-radius: 3px;
`;


export function MyButton() {
  return(
    <div>
      <Button $primary>Home</Button>
    </div>
  );
}