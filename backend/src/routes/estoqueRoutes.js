const express = require("express");
const router = express.Router();
const controller = require("../controllers/estoqueController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.listarEstoque);
router.post("/", authMiddleware, controller.criarEstoque);

module.exports = router;