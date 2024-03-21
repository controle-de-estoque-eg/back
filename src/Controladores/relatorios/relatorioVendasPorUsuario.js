const knex = require('../../conexao')

const relatorioVendasPorUsuario = async (req, res) => {
  const periodoInicio = new Date(req.body.periodoInicio)
  const periodoFim = new Date(req.body.periodoFim)
  try {
    const VendasPorUsuario = await knex('vendas')
      .select('usuario_id')
      .count('id as quantidade_vendas')
      .sum('valor_venda as total_vendido')
      .whereBetween('create_at', [periodoInicio, periodoFim])
      .groupBy('usuario_id')

    return res.status(200).json(VendasPorUsuario)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

module.exports = relatorioVendasPorUsuario
