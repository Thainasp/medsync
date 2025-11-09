import { MyButton } from "src/components/myButton"
import styled from 'styled-components';
import { Footer } from 'src/components/footer';
import { Header } from "../components/header";
import { useNavigate } from "react-router-dom";

const BackgroundDiv = styled.div`
      background-image: url("./public/assets/images/background.jpg");
      width: 105%;
      height: 100vh;
      background-size: cover;      
      background-position: left;
    `;

const ButtonsDiv = styled.div`
      height: 250px;
      margin-top: 225px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;  
    `;

export function Home() {

    const navigateLogin = useNavigate();
    const navigateCadastro = useNavigate();

    const handleClickLogin = () => {
        navigateLogin("/login");
    }
    const handleClickCadastro = () => {
        navigateCadastro("/cadastro");
    }

    return (

        <div className='home-container'>
            <BackgroundDiv>
                <Header />

                <ButtonsDiv>
                    <div>
                        <MyButton onClick={handleClickLogin}>Acessar</MyButton>
                        <MyButton onClick={handleClickCadastro}>Criar conta</MyButton>
                    </div>
                </ButtonsDiv>

                <Footer />

            </BackgroundDiv>
        </div>

    );
}