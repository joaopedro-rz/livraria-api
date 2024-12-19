const { getUsuarios, saveUsuarios } = require("../models/usuariosModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Configuração do dotenv
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "654321";

// Instalar o administrador padrão
const installAdmin = async (req, res) => {
  const usuarios = await getUsuarios();

  if (usuarios.some((usuario) => usuario.tipo === "admin")) {
    return res.status(400).json({ error: "O sistema já possui um administrador." });
  }

  const senhaHash = await bcrypt.hash("admin123", 10);
  const admin = {
    id: uuidv4(),
    nome: "Admin",
    email: "admin@admin.com",
    senha: senhaHash,
    tipo: "admin",
  };

  usuarios.push(admin);
  await saveUsuarios(usuarios);

  res.status(201).json({ message: "Administrador criado com sucesso.", admin });
};

// Cadastrar um usuário comum
const createUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const usuarios = await getUsuarios();
  if (usuarios.some((usuario) => usuario.email === email)) {
    return res.status(400).json({ error: "Já existe um usuário com este email." });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const novoUsuario = {
    id: uuidv4(),
    nome,
    email,
    senha: senhaHash,
    tipo: "comum",
  };

  usuarios.push(novoUsuario);
  await saveUsuarios(usuarios);

  res.status(201).json(novoUsuario);
};

// Login do usuário
const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  const usuarios = await getUsuarios();
  const usuario = usuarios.find((usuario) => usuario.email === email);

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};

// Criar um administrador (apenas admin)
const createAdmin = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const usuarios = await getUsuarios();
  if (usuarios.some((usuario) => usuario.email === email)) {
    return res.status(400).json({ error: "Já existe um usuário com este email." });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const novoAdmin = {
    id: uuidv4(),
    nome,
    email,
    senha: senhaHash,
    tipo: "admin",
  };

  usuarios.push(novoAdmin);
  await saveUsuarios(usuarios);

  res.status(201).json(novoAdmin);
};

// Excluir um usuário (apenas admin)
const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  const usuarios = await getUsuarios();
  const index = usuarios.findIndex((usuario) => usuario.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  if (usuarios[index].tipo === "admin") {
    return res.status(403).json({ error: "Não é possível excluir administradores." });
  }

  usuarios.splice(index, 1);
  await saveUsuarios(usuarios);

  res.status(204).send();
};

// Alterar dados pessoais (usuários comuns)
const updateUsuario = async (req, res) => {
  const { id } = req.user; // ID do usuário logado
  const { nome, email, senha } = req.body;

  const usuarios = await getUsuarios();
  const usuarioIndex = usuarios.findIndex((usuario) => usuario.id === id);

  if (usuarioIndex === -1) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  if (nome) usuarios[usuarioIndex].nome = nome;
  if (email) usuarios[usuarioIndex].email = email;
  if (senha) usuarios[usuarioIndex].senha = await bcrypt.hash(senha, 10);

  await saveUsuarios(usuarios);
  res.status(200).json({ message: "Dados alterados com sucesso." });
};


module.exports = {
  installAdmin,
  createUsuario,
  loginUsuario,
  createAdmin,
  deleteUsuario,
};
