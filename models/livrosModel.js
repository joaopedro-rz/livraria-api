const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../data/livros.json");

const getLivros = async () => {
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

const saveLivros = async (livros) => {
  await fs.writeFile(filePath, JSON.stringify(livros, null, 2));
};

module.exports = { getLivros, saveLivros };
