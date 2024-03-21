const knex = require('../../conexao')

const alertaEstoque = async (req, res) => {
  try {
    const produtosEstoqueBaixo = await knex('produtos')
      .select(
        'produtos.nome',
        'produtos.quantidade_estoque',
        'produtos.alerta_estoque'
      )
      .whereRaw('quantidade_estoque < alerta_estoque')
      .andWhere('produtos.soft_delete', false)

    const relatorioProdutos = await Promise.all(
      produtosEstoqueBaixo.map(async (produto) => {
        const fornecedores = await knex('produtos_fornecedores')
          .select('fornecedores.nome')
          .leftJoin(
            'fornecedores',
            'produtos_fornecedores.fornecedor_id',
            'fornecedores.id'
          )
          .where('produtos_fornecedores.produto_id', produto.id)
          .andWhere('produtos_fornecedores.soft_delete', false)

        return {
          nome_produto: produto.nome,
          quantidade_em_estoque: produto.quantidade_estoque,
          alerta_estoque: produto.alerta_estoque,
          fornecedores: fornecedores.map((fornecedor) => fornecedor.nome),
        }
      })
    )

    return res.status(200).json(relatorioProdutos)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

module.exports = alertaEstoque
