const knex = require('../conexao')

const cadastroPedidoProduto = async (pedido_id, lista_produtos) => {
  try {
    const todosProdutos = await knex('produtos').where({ soft_delete: false })

    lista_produtos.forEach(async (produto) => {
      const { produto_id, quantidade_produto } = produto
      const produtoDB = todosProdutos.find(
        (produtoBanco) => produtoBanco.id === produto_id
      )
      const pedidoProduto = {
        produto_id,
        pedido_id,
        quantidade_produto,
        valor_produto: produtoDB.valor_venda,
        desconto_total: produto.desconto_produto,
      }
      await knex('pedidos_produtos').insert(pedidoProduto)
    })
    return { validador: true }
  } catch (error) {
    return {
      validador: false,
      mensagem: error.message,
    }
  }
}

module.exports = cadastroPedidoProduto
