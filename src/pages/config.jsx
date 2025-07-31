export function Configurações(){
    return (
        <div className="config-container">
            <h1>Configurações Page</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="setting1">Setting 1:</label>
                    <input type="text" id="setting1" name="setting1" required />
                </div>
                <div className="form-group">
                    <label htmlFor="setting2">Setting 2:</label>
                    <input type="text" id="setting2" name="setting2" required />
                </div>
                <button type="submit">Save Settings</button>
            </form>
        </div>
    );
}