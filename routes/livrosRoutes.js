const express = require("express");
const {
  createLivro,
  getAllLivros,
  getLivroById,
  updateLivro,
  deleteLivro,
  getLivrosByAutor,
} = require("../controllers/livrosController");

const router = express.Router();

router.post("/", createLivro); // Criar livro
router.get("/", getAllLivros); // Listar livros (paginação)
router.get("/:id", getLivroById); // Buscar livro por ID
router.put("/:id", updateLivro); // Atualizar livro
router.delete("/:id", deleteLivro); // Excluir livro
router.get("/autor/:autorId", getLivrosByAutor); // Livros de um autor

module.exports = router;
