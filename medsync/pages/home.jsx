import { MyButton } from '../src/assets/components/myButton';
import styled from 'styled-components';
import background from '../src/assets/images/background.jpg';
import logo from '../src/assets/images/logo.png';

export function Home() {

    const BackgroundDiv = styled.div`
      background-image: url(${background});
      width: 100%;
      height: 100vh;
      background-size: cover;      
      background-position: left;
    `;

    const Logo = styled.img`
      width: 450px;
      height: 400px;
      display: block;
    `;

    const ButtonsDiv = styled.div`
      height: 250px;
      margin-top: 150px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;  
    `;

    return (

        <div className='home-container'>

            <BackgroundDiv>

                <div>
                    <Logo src={logo} alt="Logo Medsync" />
                </div>

                <ButtonsDiv>
                    <div>
                        <MyButton>Acessar</MyButton>
                        <MyButton>Criar conta</MyButton>
                    </div>
                </ButtonsDiv>

            </BackgroundDiv>

        </div>

    );
}