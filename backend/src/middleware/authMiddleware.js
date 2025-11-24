const jwt = require("jsonwebtoken");
const SECRET_KEY = "chave_super_secreta_do_medsync";

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    // Verifica se o token existe
    if (!authHeader) {
        return res.status(403).json({ erro: "Nenhum token fornecido." });
    }

    // Remove o "Bearer " se existir
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: "Falha na autenticação do token." });
        }

        // Salva o ID para uso nos controllers
        req.userId = decoded.id;
        next();
    });
};