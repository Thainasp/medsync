import { MyButton } from "src/components/myButton"
import styled from 'styled-components';
import { Footer } from 'src/components/footer';
import { Header } from "../components/header";

export function Home() {

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

    return (

        <div className='home-container'>
            <BackgroundDiv>
                <Header/>
                <ButtonsDiv>
                    <div>
                        <MyButton>Acessar</MyButton>
                        <MyButton>Criar conta</MyButton>
                    </div>
                </ButtonsDiv>

                <Footer/>

            </BackgroundDiv>
        </div>

    );
}