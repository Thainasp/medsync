import styled from "styled-components";
import { useState } from "react";
import { Footer } from "src/components/footer";
import { Header } from "../components/header";
import { Menu } from "../components/menu";
import { Calendar } from "src/components/calendar";
import { Medication } from "src/components/medication";
import { ModalAddMedicamento } from "./../components/ModalAddMedicamento";
import { useNavigate, Link } from "react-router-dom";
import { MyButton } from "../components/myButton";
import { FormContainer, Label, Title, InputField, StyledDivLinks, ErrorMessage, DeleteButton } from "../components/forms";


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 5% 15%;
`;

const WrapperCalendar = styled.section`
  padding: 5px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.section`
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #75A0D1;
`;

const Button = styled.button`
  background-color: #2194CA;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 40px;
  cursor: pointer;
  margin: 15px 0;
  align-self: center;
  font-size: 1.2em;

  &:hover {
    background-color: #1976d2;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const MyLink = styled.a`
  color: #000000;
  text-decoration: none;
  font-weight: bold;
  font-size: 1em;
  display: block;
  text-align: center;
  margin: 20px 0;
  padding: 15px;

  &:hover {
    text-decoration: underline;
    background-color: #f0f0f0;
    border-radius: 4px;
  }
`;

const SectionTitle = styled.p`
  font-size: 1.2em;
  font-weight: bold;
  margin: 20px 0 10px 0;
  color: #333;
`;

const SetaImage = styled.img`
  display: block;
  margin: 0 auto;
  width: 24px;
  height: 24px;
`;

export function Inicio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Calendário",
    "Minhas receitas e medicamentos",
    "Perfil",
    "Estoque",
    "Configurações"
  ];



  const medications = [
    {
      name: "Losartana",
      time: "20:00",
      note: "Tomar antes do jantar"
    },
    {
      name: "Ansitec",
      time: "09:00",
      note: ""
    },
    {
      name: "Pantoprazol",
      time: "09:00",
      note: "Tomar em jejum"
    },
    {
      name: "Sinvastatina",
      time: "22:00",
      note: "Tomar antes de dormir"
    }
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <PageContainer className="inicio-container">
      <Header
        variant="alt"
        text="Nome do Usuário"
        onMenuClick={handleMenuToggle}
      />

      <Menu
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        menuItems={menuItems}
      />

      <ContentContainer>
        <Calendar variant="header-only" />
        <SectionTitle>Medicamentos diários</SectionTitle>
        <Wrapper>
          {medications.map((med, index) => (
            <Medication
              key={index}
              name={med.name}
              time={med.time}
              note={med.note}
            />
          ))}
        </Wrapper>
        <Link to="/addReceita" style={{ textDecoration: "none" }}>
          <MyButton style={{ marginTop: "20px" }}>
            Nova Receita +
          </MyButton>
        </Link>
        <SectionTitle>Nesta semana:</SectionTitle>
        <WrapperCalendar>
          <Calendar variant="week-only" />
        </WrapperCalendar>
        <LinkContainer>
          <MyLink href="/calendario">Acessar o calendário completo </MyLink>
          <SetaImage src="./assets/images/seta.png" alt="Seta" />
        </LinkContainer>
      </ContentContainer>
      <Footer />
    </PageContainer>
  );
}