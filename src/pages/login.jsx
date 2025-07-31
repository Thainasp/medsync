import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
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