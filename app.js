// João Pedro Ribeiro Zugaib - 2525844
// Link do Github: 
require('dotenv').config(); // Carregar variáveis do .env
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const livrosRoutes = require("./routes/livrosRoutes");
const autoresRoutes = require("./routes/autoresRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");

const { isAuthenticated } = require("./middlewares/authMiddleware");

const app = express();
app.use(express.json());

// Swagger (documentação)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.use("/livros", isAuthenticated, livrosRoutes); // Rotas protegidas para livros
app.use("/autores", isAuthenticated, autoresRoutes); // Rotas protegidas para autores
app.use("/usuarios", usuariosRoutes); // Rotas públicas para usuários
router.put("/usuarios/me", isAuthenticated, updateUsuario); // Rota para alteração de dados pessoais do usuário

// Rota inicial
app.get("/", (req, res) => {
  res.status(200).json({ message: "Bem-vindo à API da Livraria!" });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
