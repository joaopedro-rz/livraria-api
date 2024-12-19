const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../data/usuarios.json");

const getUsuarios = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify([])); // Criar arquivo se não existir
      return [];
    }
    throw error;
  }
};

const saveUsuarios = async (usuarios) => {
  await fs.writeFile(filePath, JSON.stringify(usuarios, null, 2));
};

module.exports = { getUsuarios, saveUsuarios };
