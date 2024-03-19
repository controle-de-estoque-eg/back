const knex = require('../../conexao');

const produtosEmDestaque = async (req, res) => {
    const periodoInicio = new Date(req.body.periodoInicio);
    const periodoFim = new Date(req.body.periodoFim);
    try {
        // Produtos mais vendidos por período
        const produtosMaisVendidos = await knex('vendas_produtos')
            .join('produtos', 'vendas_produtos.produto_id', '=', 'produtos.id')
            .join('vendas', 'vendas_produtos.venda_id', '=', 'vendas.id')
            .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
            .groupBy('produtos.id')
            .select('produtos.id', 'produtos.nome', knex.raw('SUM(vendas_produtos.quantidade_produto) as total_vendido'))
            .orderBy('total_vendido', 'desc')
            .limit(10);

        // Produtos que geram mais lucro
        const produtosMaiorLucro = await knex('vendas_produtos')
            .join('produtos', 'vendas_produtos.produto_id', '=', 'produtos.id')
            .join('vendas', 'vendas_produtos.venda_id', '=', 'vendas.id')
            .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
            .groupBy('produtos.id')
            .select('produtos.id', 'produtos.nome', knex.raw('(SUM(vendas_produtos.valor_venda) - SUM(vendas_produtos.valor_custo)) as lucro_total'))
            .orderBy('lucro_total', 'desc')
            .limit(10);

        // Produtos com baixo desempenho de vendas
        const produtosBaixoDesempenho = await knex('vendas_produtos')
            .join('produtos', 'vendas_produtos.produto_id', '=', 'produtos.id')
            .join('vendas', 'vendas_produtos.venda_id', '=', 'vendas.id')
            .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
            .groupBy('produtos.id')
            .having(knex.raw('SUM(vendas_produtos.quantidade_produto) < 10')) // Exemplo de filtro para baixo desempenho
            .select('produtos.id', 'produtos.nome', knex.raw('SUM(vendas_produtos.quantidade_produto) as total_vendido'))
            .orderBy('total_vendido', 'asc')
            .limit(10);


        return res.status(200).json({
            produtosMaisVendidos,
            produtosMaiorLucro,
            produtosBaixoDesempenho
        });
    }
    catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}


module.exports = produtosEmDestaque
