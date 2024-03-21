const fs = require('fs');
const path = require('path');

// Função para salvar o arquivo localmente
function salvarArquivoLocal(id, req) {
    // Verifica se o diretório existe, se não, cria o diretório
    const diretorio = path.join('C:/imagemT', id.toString()); // Converte o ID para string
    if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio, { recursive: true });
    }

    // Move o arquivo para o diretório criado
    const file = req.file;
    if (file) {
        const destino = path.join(diretorio, file.originalname);
        fs.renameSync(file.path, destino);
        const urlImagem = destino.replace(/\\/g, '/');
        return urlImagem;
    } else {
        return null;
    }
}

module.exports = salvarArquivoLocal;
