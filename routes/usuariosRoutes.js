const express = require("express");
const {
  installAdmin,
  createUsuario,
  loginUsuario,
  createAdmin,
  deleteUsuario,
} = require("../controllers/usuariosController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/install", installAdmin); // Instalar admin padrão
router.post("/", createUsuario); // Cadastrar usuário
router.post("/login", loginUsuario); // Login
router.post("/admin", isAuthenticated, isAdmin, createAdmin); // Criar admin
router.delete("/:id", isAuthenticated, isAdmin, deleteUsuario); // Excluir usuário

module.exports = router;
