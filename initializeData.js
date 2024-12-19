const fs = require("fs/promises");
const path = require("path");

const initializeData = async () => {
  try {
    const dataDir = path.join(__dirname, "data");

    // Verifica se a pasta 'data' existe, se não cria.
    await fs.mkdir(dataDir, { recursive: true });

    const arquivos = [
      { nome: "autores.json", conteudo: [] },
      { nome: "livros.json", conteudo: [] },
      { nome: "usuarios.json", conteudo: [] },
    ];

    for (const arquivo of arquivos) {
      const filePath = path.join(dataDir, arquivo.nome);

      try {
        await fs.access(filePath); // Verifica se o arquivo existe
      } catch {
        // Se o arquivo não existir, cria com conteúdo inicial
        await fs.writeFile(filePath, JSON.stringify(arquivo.conteudo, null, 2));
        console.log(`Arquivo '${arquivo.nome}' criado com sucesso.`);
      }
    }

    console.log("Arquivos de dados inicializados.");
  } catch (error) {
    console.error("Erro ao inicializar os arquivos de dados:", error.message);
  }
};

initializeData();
