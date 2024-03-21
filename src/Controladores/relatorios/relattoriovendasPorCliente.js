const knex = require('../../conexao')
const vendasPorCliente = async (req, res) => {
  const periodoInicio = new Date(req.body.periodoInicio)
  const periodoFim = new Date(req.body.periodoFim)
  try {
    const vendasPorCliente = await knex('vendas')
      .select(
        'clientes.nome as cliente',
        knex.raw('count(*) as quantidade_vendas')
      )
      .join('clientes', 'vendas.cliente_id', '=', 'clientes.id')
      .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
      .groupBy('clientes.nome')

    const valorPorCliente = await knex('vendas')
      .select(
        'clientes.nome as cliente',
        knex.raw('sum(valor_venda) as total_vendas')
      )
      .join('clientes', 'vendas.cliente_id', '=', 'clientes.id')
      .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
      .groupBy('clientes.nome')

    return res.status(200).json({ vendasPorCliente, valorPorCliente })
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

module.exports = vendasPorCliente
