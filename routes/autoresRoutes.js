const express = require("express");
const {
  createAutor,
  getAllAutores,
  getAutorById,
  updateAutor,
  deleteAutor,
} = require("../controllers/autoresController");

const router = express.Router();

router.post("/", createAutor); // Criar autor
router.get("/", getAllAutores); // Listar autores (paginação)
router.get("/:id", getAutorById); // Buscar autor por ID
router.put("/:id", updateAutor); // Atualizar autor
router.delete("/:id", deleteAutor); // Excluir autor

module.exports = router;
