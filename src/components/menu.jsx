import styled from "styled-components";
import { Link } from "react-router-dom"; // Importe o Link

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  font-family: 'Nunito', sans-serif;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 85px;
  left: 0;
  width: 100%;
  height: calc(100% - 85px - 60px);
  background-color: white;
  z-index: 1001;
  padding: 20px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 40px;
  margin: 0;
  width: 60%;
`;

const MenuItem = styled.li`
  padding: 20px 15px;
  border-bottom: 1px solid #000000;
  font-size: 1.2rem;
  color: black;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  width: 100%;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: black;
  display: block;
  width: 100%;
  height: 100%;
  
  &:hover {
    color: black;
  }
`;

export function Menu({ isOpen, onClose, menuItems }) {
  if (!isOpen) return null;


  const getRouteForMenuItem = (item) => {
    const routeMap = {
      "Calendário": "/calendario",
      "Minhas receitas e medicamentos": "/medicamentos",
      "Perfil": "/perfil",
      "Estoque": "/estoque",
      "Configurações": "/configuracoes",
      "Sair": "/sair"
    };
    return routeMap[item] || "/";
  };

  return (
    <>
      <MenuOverlay $isOpen={isOpen} onClick={onClose} />
      <MenuContainer>
        <MenuList>
          {menuItems.map((item, index) => (
            <MenuItem key={index}>
              <MenuLink 
                to={getRouteForMenuItem(item)} 
                onClick={onClose}
              >
                {item}
              </MenuLink>
            </MenuItem>
          ))}
        </MenuList>
      </MenuContainer>
    </>
  );
}