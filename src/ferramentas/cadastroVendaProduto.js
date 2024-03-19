const knex = require('../conexao');

const cadastraVendaProduto = async (venda_id, lista_produtos) => {
    try {
        const todosProdutos = await knex('produtos').where({ soft_delete: false });

        lista_produtos.forEach(async (produto) => {
            const { produto_id, quantidade_produto, valor_custo, valor_venda, desconto } = produto;
            const produtoDB = todosProdutos.find((produtoBanco) => produtoBanco.id === produto_id);
            const vendaProduto = {
                produto_id,
                venda_id,
                quantidade_produto,
                valor_venda: valor_venda * quantidade_produto,
                valor_custo: valor_custo * quantidade_produto,
                lucro_total: (valor_venda * quantidade_produto) - (valor_custo * quantidade_produto),
                desconto
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