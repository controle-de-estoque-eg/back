const knex = require('../conexao')

const diminuirEstoque = async (produtos) => {
  try {
    const todosProdutos = await knex('produtos').where({ soft_delete: false })
    const novoValorEstoque = produtos.forEach(async (produto) => {
      const produtoBanco = todosProdutos.find(
        (produtoBanco) => produtoBanco.id === produto.produto_id
      )
      const novoEstoque =
        Number(produtoBanco.quantidade_estoque) -
        Number(produto.quantidade_produto)
      await knex('produtos')
        .where({ id: produto.produto_id })
        .update({ quantidade_estoque: novoEstoque })
    })
    return { validador: true }
  } catch (error) {
    return {
      validador: false,
      mensagem: error.message,
    }
  }
}

module.exports = diminuirEstoque
