import { MyButton } from '../src/assets/components/myButton';

export function Home() {
    return (
        
        <div className='home-container'>
            <div>
            <MyButton>Acessar</MyButton>
            </div>
            <div>
            <MyButton>Criar conta</MyButton>
            </div>
        </div>
         
    );
}