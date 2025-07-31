import { Footer } from "../components/footer/footer";
import { TelaBase } from "../components/telaBase";
import { Header } from "../components/header/header";
export function Login() {
    return (
        <div className="login-container">
            <TelaBase>
                <Header/>
                <h1>Login Page</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <Footer/>
            </TelaBase>
        </div>
        
    );
}