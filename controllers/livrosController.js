const { getLivros, saveLivros } = require("../models/livrosModel");
const { getAutores } = require("../models/autorerModel"); // Para vincular livros a autores

// Listar todos os livros
const listarLivros = async (req, res) => {
  try {
    const livros = await getLivros();
    res.status(200).json(livros);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar livros", error: error.message });
  }
};

// Buscar um livro por ID
const buscarLivroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const livros = await getLivros();
    const livro = livros.find((livro) => livro.id === id);

    if (!livro) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    res.status(200).json(livro);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar o livro", error: error.message });
  }
};

// Criar um novo livro
const criarLivro = async (req, res) => {
  try {
    const { titulo, autorId, genero, ano } = req.body;

    // Validar se o autor existe
    const autores = await getAutores();
    const autor = autores.find((autor) => autor.id === autorId);

    if (!autor) {
      return res.status(400).json({ message: "Autor não encontrado" });
    }

    const livros = await getLivros();
    const novoLivro = {
      id: String(Date.now()), // Gerar ID único
      titulo,
      autorId,
      autorNome: autor.nome, // Vincular o nome do autor ao livro
      genero,
      ano,
    };

    livros.push(novoLivro);
    await saveLivros(livros);

    res.status(201).json({ message: "Livro criado com sucesso", livro: novoLivro });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o livro", error: error.message });
  }
};

// Atualizar um livro por ID
const atualizarLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autorId, genero, ano } = req.body;

    const livros = await getLivros();
    const livroIndex = livros.findIndex((livro) => livro.id === id);

    if (livroIndex === -1) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    // Validar se o autor existe
    const autores = await getAutores();
    const autor = autores.find((autor) => autor.id === autorId);

    if (!autor) {
      return res.status(400).json({ message: "Autor não encontrado" });
    }

    // Atualizar os dados do livro
    livros[livroIndex] = {
      ...livros[livroIndex],
      titulo,
      autorId,
      autorNome: autor.nome, // Atualizar o nome do autor vinculado
      genero,
      ano,
    };

    await saveLivros(livros);

    res.status(200).json({ message: "Livro atualizado com sucesso", livro: livros[livroIndex] });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o livro", error: error.message });
  }
};

// Excluir um livro por ID
const excluirLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const livros = await getLivros();

    const livroIndex = livros.findIndex((livro) => livro.id === id);

    if (livroIndex === -1) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    livros.splice(livroIndex, 1); // Remover o livro da lista
    await saveLivros(livros);

    res.status(200).json({ message: "Livro excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir o livro", error: error.message });
  }
};

module.exports = {
  listarLivros,
  buscarLivroPorId,
  criarLivro,
  atualizarLivro,
  excluirLivro,
};
