const knex = require('../../conexao')

const relatorioPagamento = async (req, res) => {
  const periodoInicio = new Date(req.body.periodoInicio)
  const periodoFim = new Date(req.body.periodoFim)
  try {
    const vendasFormasPagamento = await knex('vendas_formas_pagamento')
      .select('*')
      .join('vendas', 'vendas.id', '=', 'vendas_formas_pagamento.venda_id')
      .whereBetween('vendas.create_at', [periodoInicio, periodoFim])

    const formasPagamento = await knex('formas_pagamento').select('*')

    const totalVendas = vendasFormasPagamento.length

    const pagamentosPorTipo = {}
    formasPagamento.forEach((forma) => {
      const pagamentos = vendasFormasPagamento.filter(
        (vfp) => vfp.forma_pagamento_id === forma.id
      )
      pagamentosPorTipo[forma.nome] = pagamentos.length
    })

    const porcentagens = {}
    Object.keys(pagamentosPorTipo).forEach((tipo) => {
      porcentagens[tipo] = (
        (pagamentosPorTipo[tipo] / totalVendas) *
        100
      ).toFixed(2)
    })

    return res.status(200).json(porcentagens)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

module.exports = relatorioPagamento
