const knex = require('../../conexao');

const relatorioLucro = async (req, res) => {
    const periodoInicio = new Date(req.body.periodoInicio);
    const periodoFim = new Date(req.body.periodoFim);
    try {
        // Venda líquida (valor total das vendas - custo total das vendas)
        const vendaLiquida = await knex('vendas')
            .whereBetween('create_at', [periodoInicio, periodoFim])
            .select(knex.raw('SUM(vendas.valor_venda - vendas.valor_custo) as venda_liquida'))
            .first();

        // Custo de vendas (valor total dos custos das vendas)
        const custoVendas = await knex('vendas')
            .whereBetween('create_at', [periodoInicio, periodoFim])
            .sum('valor_custo')
            .first();

        // Lucro bruto (valor total das vendas - custo total das vendas)
        const lucroBruto = await knex('vendas')
            .whereBetween('create_at', [periodoInicio, periodoFim])
            .sum('valor_venda')
            .first();

        // % de lucro (% de lucro = (lucro bruto / custo de vendas) * 100)
        const percentualLucro = (vendaLiquida.venda_liquida / lucroBruto.sum) * 100;

        // Margem de lucro por categoria de produto
        const margemLucroCategoria = await knex('vendas_produtos')
            .join('produtos', 'vendas_produtos.produto_id', '=', 'produtos.id')
            .join('vendas', 'vendas_produtos.venda_id', '=', 'vendas.id')
            .join('categorias', 'produtos.categoria_id', '=', 'categorias.id')
            .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
            .groupBy('produtos.categoria_id', 'categorias.nome')
            .select('produtos.categoria_id', 'categorias.nome as nome_categoria', knex.raw('ROUND(((SUM(vendas_produtos.valor_venda) - SUM(vendas_produtos.valor_custo)) / SUM(vendas_produtos.valor_venda) * 100), 2) as margem_lucro'));

        return res.status(200).json({
            Receita_total: parseFloat(lucroBruto.sum).toFixed(2),
            Lucro: parseFloat(vendaLiquida.venda_liquida).toFixed(2),
            Custos_totais: parseFloat(custoVendas.sum).toFixed(2),
            percentualLucro: parseFloat(percentualLucro).toFixed(2) + '%',
            margemLucroCategoria,

        })
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

module.exports = relatorioLucro;


module.exports = relatorioLucro