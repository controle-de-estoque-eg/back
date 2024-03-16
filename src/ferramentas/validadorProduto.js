const knex = require('../conexao')

const validadorProduto = async (pedido_produtos) => {
    try {
        const resultado = {};

        pedido_produtos.forEach(item => {
            const { produto_id, quantidade_produto } = item;
            if (resultado[produto_id]) {
                resultado[produto_id] += quantidade_produto;
            } else {
                resultado[produto_id] = quantidade_produto;
            }
        });

        const entrada = resultado;

        const ids = Object.keys(entrada);
        const rows = await knex('produtos').where({ soft_delete: false }).whereIn('id', ids).select('id', 'quantidade_estoque');

        const produtosInsuficienteEstoque = [];

        rows.forEach(row => {
            const novoEstoque = row.quantidade_estoque - entrada[row.id];

            if (novoEstoque < 0) {
                produtosInsuficienteEstoque.push(row.id);
            } else {
                resultado[row.id] = novoEstoque;
            }
        });

        if (produtosInsuficienteEstoque.length > 0) {
            return {
                validador: false,
                mensagem: `Estoque insuficiente para os seguintes produtos ID: ${produtosInsuficienteEstoque.join(', ')}`
            };
        }

        return {
            validador: true
        };
    } catch (error) {
        return {
            validador: false,
            mensagem: error.message
        }
    }
}


module.exports = validadorProduto