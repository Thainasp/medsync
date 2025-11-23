const express = require("express");
const router = express.Router();
const controller = require("../controllers/prescricaoController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.listarPrescricoes);
router.post("/", authMiddleware, controller.criarPrescricao);

module.exports = router;