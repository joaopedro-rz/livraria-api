const jwt = require("jsonwebtoken");

// Configuração do dotenv
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "654321";

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.tipo !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a administradores." });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
