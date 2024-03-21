const knex = require('../conexao')

const aumentarEstoque = async (lista_produtos) => {
  try {
    await knex.transaction(async (trx) => {
      for (const produto of lista_produtos) {
        await knex('produtos')
          .transacting(trx)
          .where('id', produto.produto_id)
          .increment('quantidade_estoque', produto.quantidade_produto)
      }

      await trx.commit()
    })

    return { validador: true }
  } catch (error) {
    return {
      validador: false,
      mensagem: error.message,
    }
  }
}

module.exports = aumentarEstoque
