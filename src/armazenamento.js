const fs = require('fs')
const path = require('path')

// Função para salvar o arquivo localmente
function salvarArquivoLocal(id, req) {
  // Verifica se o diretório existe, se não, cria o diretório
  const diretorio = path.join('C:/imagemT', id.toString()) // Converte o ID para string
  if (!fs.existsSync(diretorio)) {
    fs.mkdirSync(diretorio, { recursive: true })
  }

  // Move o arquivo para o diretório criado
  const file = req.file
  if (file) {
    const destino = path.join(diretorio, file.originalname)
    fs.renameSync(file.path, destino)
    const urlImagem = destino.replace(/\\/g, '/')
    return urlImagem
  } else {
    return null
  }
}

// Função para editar a imagem
function editarImagem(id, req) {
  const diretorio = path.join('C:/imagemT', id.toString())
  if (!fs.existsSync(diretorio)) {
    fs.mkdirSync(diretorio, { recursive: true })
  } else {
    const arquivos = fs.readdirSync(diretorio)
    for (const arquivo of arquivos) {
      const caminhoArquivo = path.join(diretorio, arquivo)
      fs.unlinkSync(caminhoArquivo)
    }
  }

  const file = req.file
  if (file) {
    const destino = path.join(diretorio, file.originalname)
    fs.renameSync(file.path, destino)
    const urlImagem = destino.replace(/\\/g, '/')
    return urlImagem
  } else {
    return null
  }
}

function excluir(id) {
  // Caminho do diretório a ser excluído
  const diretorio = path.join('C:/imagemT', id.toString()) // Converte o ID para string

  // Verifica se o diretório existe antes de excluir
  if (fs.existsSync(diretorio)) {
    // Remove o diretório e todo o seu conteúdo de forma recursiva
    fs.rmdirSync(diretorio, { recursive: true })
    console.log(`Pasta ${diretorio} e seu conteúdo foram excluídos.`)
  } else {
    console.log(`Pasta ${diretorio} não existe.`)
  }
}

module.exports = { salvarArquivoLocal, editarImagem, excluir }
