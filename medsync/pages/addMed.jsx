export function AdicionarMed() {
    return (
        <div className="adicionar-medicamento-container">
            <h1>Adicionar Medicamento Page</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="medicamento">Medicamento:</label>
                    <input type="text" id="medicamento" name="medicamento" required />
                </div>
                <div className="form-group">
                    <label htmlFor="dosagem">Dosagem:</label>
                    <input type="text" id="dosagem" name="dosagem" required />
                </div>
                <button type="submit">Adicionar</button>
            </form>
        </div>
    );
}