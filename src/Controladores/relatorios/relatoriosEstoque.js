const knex = require('../../conexao');

const relatorioEstoque = async (req, res) => {
    try {
        // Estoque Custo
        const estoqueCusto = await knex('produtos')
            .sum(knex.raw('valor_custo * quantidade_estoque'))
            .first();

        // Estoque Venda
        const estoqueVenda = await knex('produtos')
            .sum(knex.raw('valor_venda * quantidade_estoque'))
            .first();

        // Lucro Estimado
        const lucroEstimado = await knex('produtos')
            .sum(knex.raw('(valor_venda - valor_custo) * quantidade_estoque'))
            .first();

        return res.status(200).json({
            estoqueCusto: estoqueCusto.sum || 0,
            estoqueVenda: estoqueVenda.sum || 0,
            lucroEstimado: lucroEstimado.sum || 0

        })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = relatorioEstoque