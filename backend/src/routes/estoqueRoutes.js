const express = require("express");
const router = express.Router();
const controller = require("../controllers/estoqueController");

router.get("/", controller.listarEstoque);
router.post("/", controller.criarEstoque);

module.exports = router;
