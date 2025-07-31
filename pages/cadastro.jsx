import './cadastro.css';

export function Cadastro() {
    return (
        <div className="cadastro-container">
            <h1>Cadastro Page</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}