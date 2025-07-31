export function EditarMedicamento() {
    return (
        <div className="editar-medicamento-container">
            <h1>Editar Medicamento Page</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="medicamento">Medicamento:</label>
                    <input type="text" id="medicamento" name="medicamento" required />
                </div>
                <div className="form-group">
                    <label htmlFor="dosagem">Dosagem:</label>
                    <input type="text" id="dosagem" name="dosagem" required />
                </div>
                <button type="submit">Salvar</button>
            </form>
        </div>
    );
}