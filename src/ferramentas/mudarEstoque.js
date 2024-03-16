const knex = require('../conexao');


const mudarEstoque = async (lista_produtos) => {
    try {
        // Iniciar uma transação
        await knex.transaction(async (trx) => {
            // Para cada produto na lista
            for (const produto of lista_produtos) {
                // Atualizar o estoque do produto na tabela produtos
                await knex('produtos')
                    .transacting(trx)
                    .where('id', produto.produto_id)
                    .increment('quantidade_estoque', produto.quantidade_produto)
            }

            // Commit da transação se tudo ocorrer bem
            await trx.commit();
        });

        return { validador: true };
    } catch (error) {
        // Rollback da transação em caso de erro
        return {
            validador: false,
            mensagem: error.message
        };
    }
};




module.exports = mudarEstoque