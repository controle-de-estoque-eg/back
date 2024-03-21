const fs = require('fs');
const path = require('path');

// Função para salvar o arquivo localmente
function salvarArquivoLocal(id, req) {
    try {
        const diretorio = path.join('C:/imagemT', id.toString());
        if (!fs.existsSync(diretorio)) {
            fs.mkdirSync(diretorio, { recursive: true });
        }

        const file = req.file;
        if (file) {
            const destino = path.join(diretorio, file.originalname);
            fs.renameSync(file.path, destino);
            const urlImagem = destino.replace(/\\/g, '/');
            return urlImagem;
        } else {
            return null;
        }
    } catch (error) {
        throw new CustomError('Erro ao salvar o arquivo.', 500);
    }
}

// Função para editar a imagem
function editarImagem(id, req) {

    try {
        const diretorio = path.join('C:/imagemT', id.toString());
        if (!fs.existsSync(diretorio)) {
            fs.mkdirSync(diretorio, { recursive: true });
        } else {
            const arquivos = fs.readdirSync(diretorio);
            for (const arquivo of arquivos) {
                const caminhoArquivo = path.join(diretorio, arquivo);
                fs.unlinkSync(caminhoArquivo);
            }
        }

        const file = req.file;
        if (file) {
            const destino = path.join(diretorio, file.originalname);
            fs.renameSync(file.path, destino);
            const urlImagem = destino.replace(/\\/g, '/');
            return urlImagem;
        } else {
            return null;
        }
    } catch (error) {
        throw new CustomError('Erro ao salvar o arquivo.', 500);
    }

}

// Função para excluir o diretório
function excluir(id) {
    const diretorio = path.join('C:/imagemT', id.toString());
    try {
        if (fs.existsSync(diretorio)) {
            fs.rmSync(diretorio, { recursive: true });
        } else {
            throw new CustomError('Diretório não encontrado.', 404);
        }
    } catch (error) {
        throw new CustomError('Erro ao excluir o diretório.', 500);
    }
}

module.exports = { salvarArquivoLocal, editarImagem, excluir };

