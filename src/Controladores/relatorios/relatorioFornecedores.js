const knex = require("../../conexao");

const relatorioFornecedores = async (req, res) => {
    const periodoInicio = new Date(req.body.periodoInicio);
    const periodoFim = new Date(req.body.periodoFim);
    try {
        const vendasPorFornecedor = await knex('produtos_fornecedores')
            .select('fornecedor_id')
            .count('vendas.id as quantidade_vendas')
            .leftJoin('vendas_produtos', 'produtos_fornecedores.produto_id', 'vendas_produtos.produto_id')
            .leftJoin('vendas', 'vendas_produtos.venda_id', 'vendas.id')
            .whereBetween('vendas.create_at', [periodoInicio, periodoFim]).groupBy('fornecedor_id');

        const valorPorFornecedor = await knex('produtos_fornecedores')
            .select('fornecedor_id')
            .sum('vendas.valor_venda as total_valor')
            .leftJoin('vendas_produtos', 'produtos_fornecedores.produto_id', 'vendas_produtos.produto_id')
            .leftJoin('vendas', 'vendas_produtos.venda_id', 'vendas.id')
            .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
            .groupBy('fornecedor_id');

        const maioresFornecedores = await knex('produtos_fornecedores')
            .select('fornecedor_id')
            .count('vendas.id as quantidade_vendas')
            .sum('vendas.valor_venda as total_valor')
            .leftJoin('vendas_produtos', 'produtos_fornecedores.produto_id', 'vendas_produtos.produto_id')
            .leftJoin('vendas', 'vendas_produtos.venda_id', 'vendas.id')
            .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
            .groupBy('fornecedor_id')
            .orderByRaw('quantidade_vendas DESC, total_valor DESC')
            .limit(10); // Exemplo: limite para os 10 maiores fornecedores

        const relatorioFornecedores = {
            vendasPorFornecedor,
            valorPorFornecedor,
            maioresFornecedores
        };

        return res.status(200).json(relatorioFornecedores);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

module.exports = relatorioFornecedores