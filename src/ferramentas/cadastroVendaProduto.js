const knex = require('../conexao');

const cadastraVendaProduto = async (venda_id, lista_produtos) => {
    try {
        const todosProdutos = await knex('produtos').where({ soft_delete: false });

        lista_produtos.forEach(async (produto) => {
            const { produto_id, quantidade_produto } = produto;
            const produtoDB = todosProdutos.find((produtoBanco) => produtoBanco.id === produto_id);
            const vendaProduto = {
                produto_id,
                venda_id,
                quantidade_produto,
                valor_produto: produtoDB.valor_venda,
                desconto_total: produto.desconto_produto
            };
            await knex('vendas_produtos').insert(vendaProduto);
        });
        return { validador: true }
    } catch (error) {
        return {
            validador: false,
            mensagem: error.message
        }
    }

};

module.exports = cadastraVendaProduto;