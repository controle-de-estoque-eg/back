const knex = require("../../conexao");

const relatorioProCat = async (req, res) => {
    const periodoInicio = new Date(req.body.periodoInicio);
    const periodoFim = new Date(req.body.periodoFim);
    try {
        const produtosMaisVendidos = await knex('vendas_produtos')
            .select('produtos.nome as produto', knex.raw('sum(vendas_produtos.quantidade_produto) as quantidade_vendas'), knex.raw('sum(vendas_produtos.valor_venda) as total_vendas'))
            .join('produtos', 'vendas_produtos.produto_id', '=', 'produtos.id')
            .join('vendas', 'vendas_produtos.venda_id', '=', 'vendas.id')
            .whereBetween('vendas_produtos.create_at', [periodoInicio, periodoFim])
            .groupBy('produtos.nome')
            .orderBy('quantidade_vendas', 'desc'); // Ordenar por quantidade de vendas em ordem decrescente

        // Relatório de categorias mais vendidas
        const categoriasMaisVendidas = await knex('vendas_produtos')
            .select('produtos.categoria_id', knex.raw('sum(vendas_produtos.quantidade_produto) as quantidade_vendas'), knex.raw('sum(vendas_produtos.valor_venda) as total_vendas'))
            .join('produtos', 'vendas_produtos.produto_id', '=', 'produtos.id')
            .join('vendas', 'vendas_produtos.venda_id', '=', 'vendas.id')
            .whereBetween('vendas_produtos.create_at', [periodoInicio, periodoFim])
            .groupBy('produtos.categoria_id');

        // Relatório de rentabilidade por produto
        const rentabilidadeProdutos = await knex('produtos')
            .select('produtos.nome as produto', knex.raw('sum(historico_venda.valor_venda - historico_custo.valor_custo) as lucro_total'))
            .join('historico_custo', 'produtos.id', '=', 'historico_custo.produto_id')
            .join('historico_venda', 'produtos.id', '=', 'historico_venda.produto_id')
            .whereBetween('historico_custo.create_at', [periodoInicio, periodoFim])
            .groupBy('produtos.nome');


        return res.status(200).json({ produtosMaisVendidos, categoriasMaisVendidas, rentabilidadeProdutos });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

module.exports = relatorioProCat