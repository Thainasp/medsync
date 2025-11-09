import { Header } from "../components/header";
import styled from "styled-components";
import { Calendar } from "src/components/calendar";
import { Footer } from "src/components/footer";
import { Menu } from "src/components/menu";
import { useState } from "react";

const WrapperCalendar = styled.section`
  padding: 2em;
  margin: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

export function Calendario() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Home",
    "Calendário", 
    "Perfil",
    "Configurações",
    "Sair"
  ];

  const toggleMenu = () => {
    console.log('Menu clicado! Estado atual:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <PageContainer className="calendario-container">
      <Header 
        variant="alt" 
        text="Calendário" 
        onMenuClick={toggleMenu} // ← AGORA ESTÁ PASSANDO A FUNÇÃO!
      />       
      
      <Menu 
        isOpen={isMenuOpen}
        onClose={closeMenu}
        menuItems={menuItems}
      />
      
      <WrapperCalendar>
        <Calendar variant="weekOnly" />
      </WrapperCalendar>
      
      <Footer />
    </PageContainer>
  );
}