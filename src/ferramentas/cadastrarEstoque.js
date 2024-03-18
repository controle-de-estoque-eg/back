const { Knex } = require('knex');
const knex = require('../conexao');

const cadastrarEstoqueProduto = async (movimento_estoque_id, lista_produtos) => {
    try {
        const todosProdutos = await knex('produtos').where({ soft_delete: false });

        lista_produtos.forEach(async (produto) => {
            const { produto_id, quantidade_produto, valor_custo } = produto;
            const produtoDB = todosProdutos.find((produtoBanco) => produtoBanco.id === produto_id);
            const vendaProduto = {
                produto_id,
                movimento_estoque_id,
                valor_custo,
                quantidade_produto
            };
            await knex('produto_movimento_estoque').insert(vendaProduto);
            await knex('historico_custo').insert({ produto_id, valor_custo })
        });
        return { validador: true }
    } catch (error) {
        return {
            validador: false,
            mensagem: error.message
        }
    }

};

module.exports = cadastrarEstoqueProduto;