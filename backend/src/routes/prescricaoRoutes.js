const express = require("express");
const router = express.Router();
const controller = require("../controllers/prescricaoController");
const authMiddleware = require("../middleware/authMiddleware");

// Protege todas as rotas de prescrição
router.use(authMiddleware);

router.get("/", controller.listarPrescricoes);
router.post("/", controller.criarPrescricao);

module.exports = router;