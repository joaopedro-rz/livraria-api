const { getAutores, saveAutores } = require("../models/autoresModel");
const { v4: uuidv4 } = require("uuid"); // Para gerar IDs únicos

// Criar um novo autor
const createAutor = async (req, res) => {
  const { nome, nacionalidade, dataNascimento, biografia } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
  }

  const autores = await getAutores();
  const novoAutor = {
    id: uuidv4(),
    nome,
    nacionalidade: nacionalidade || "Desconhecida",
    dataNascimento: dataNascimento || null,
    biografia: biografia || "",
  };

  autores.push(novoAutor);
  await saveAutores(autores);

  res.status(201).json(novoAutor);
};

// Listar todos os autores (com paginação)
const getAllAutores = async (req, res) => {
  const { limite = 10, pagina = 1 } = req.query;
  const autores = await getAutores();

  const startIndex = (pagina - 1) * limite;
  const endIndex = startIndex + parseInt(limite);

  const paginatedAutores = autores.slice(startIndex, endIndex);
  res.json({ total: autores.length, autores: paginatedAutores });
};

// Buscar um autor por ID
const getAutorById = async (req, res) => {
  const { id } = req.params;
  const autores = await getAutores();
  const autor = autores.find((autor) => autor.id === id);

  if (!autor) {
    return res.status(404).json({ error: "Autor não encontrado." });
  }

  res.json(autor);
};

// Atualizar um autor
const updateAutor = async (req, res) => {
  const { id } = req.params;
  const { nome, nacionalidade, dataNascimento, biografia } = req.body;

  const autores = await getAutores();
  const index = autores.findIndex((autor) => autor.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Autor não encontrado." });
  }

  autores[index] = {
    ...autores[index],
    nome: nome || autores[index].nome,
    nacionalidade: nacionalidade || autores[index].nacionalidade,
    dataNascimento: dataNascimento || autores[index].dataNascimento,
    biografia: biografia || autores[index].biografia,
  };

  await saveAutores(autores);
  res.json(autores[index]);
};

// Excluir um autor
const deleteAutor = async (req, res) => {
  const { id } = req.params;
  const autores = await getAutores();

  const updatedAutores = autores.filter((autor) => autor.id !== id);

  if (updatedAutores.length === autores.length) {
    return res.status(404).json({ error: "Autor não encontrado." });
  }

  await saveAutores(updatedAutores);
  res.status(204).send(); // Sem conteúdo
};

module.exports = {
  createAutor,
  getAllAutores,
  getAutorById,
  updateAutor,
  deleteAutor,
};
