import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";
import { StyledQuadro } from "../components/quadro";
import { StyledPParaQuadro } from "../components/quadro";
export function Login() {
  return (
    <div className="login-container">
      <TelaBase>
        <Header />
        <h1>Acesse</h1>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <MyButton>Entrar</MyButton>
        </form>
        <Footer />
      </TelaBase>
    </div>
  );
}
