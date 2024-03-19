const knex = require('../../conexao')

async function getQuantidadeVendas(periodoInicio, periodoFim) {
    return knex('vendas')
        .whereBetween('create_at', [periodoInicio, periodoFim])
        .count('id')
        .then(([result]) => result);
}

async function getTicketMedio(periodoInicio, periodoFim) {
    return knex('vendas')
        .whereBetween('create_at', [periodoInicio, periodoFim])
        .avg('valor_venda')
        .then(([result]) => result);
}

async function getQuantidadeItensVendidos(periodoInicio, periodoFim) {
    return knex('vendas_produtos')
        .join('vendas', 'vendas_produtos.venda_id', '=', 'vendas.id')
        .whereBetween('vendas.create_at', [periodoInicio, periodoFim])
        .sum('quantidade_produto')
        .then(([result]) => result);
}

async function getValorTotalVendas(periodoInicio, periodoFim) {
    return knex('vendas')
        .whereBetween('create_at', [periodoInicio, periodoFim])
        .sum('valor_venda')
        .then(([result]) => result);
}

const relatorioVendas = async (req, res) => {
    const periodoInicio = new Date(req.body.periodoInicio);
    const periodoFim = new Date(req.body.periodoFim);
    try {
        const quantidadeVendas = await getQuantidadeVendas(periodoInicio, periodoFim);
        const ticketMedio = await getTicketMedio(periodoInicio, periodoFim);
        const quantidadeItensVendidos = await getQuantidadeItensVendidos(periodoInicio, periodoFim);
        const valorTotalVendas = await getValorTotalVendas(periodoInicio, periodoFim);

        return res.status(201).json({
            quantidadeVendas: parseInt(quantidadeVendas.count),
            ticketMedio: parseFloat(ticketMedio.avg).toFixed(2),
            quantidadeItensVendidos: parseInt(quantidadeItensVendidos.sum),
            valorTotalVendas: parseFloat(valorTotalVendas.sum).toFixed(2)
        });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = relatorioVendas