const jwt = require("jsonwebtoken");
const SECRET_KEY = "chave_super_secreta_do_medsync"; // Tem que ser IGUAL a do pacienteController

module.exports = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ erro: "Nenhum token fornecido." });
    }

    // O token geralmente vem como "Bearer eyJhbG..."
    // Vamos remover o "Bearer " se ele existir, ou pegar direto
    const tokenPuro = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

    jwt.verify(tokenPuro, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: "Falha na autenticação do token." });
        }

        // A MÁGICA ACONTECE AQUI:
        // Salvamos o ID do usuário dentro da requisição (req)
        req.userId = decoded.id; 
        
        next(); // Pode passar para o controller
    });
};