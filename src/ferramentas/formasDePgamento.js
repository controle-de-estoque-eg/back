const knex = require('../conexao');


const formasDePagamento = async (venda_id, lista_pagamentos) => {
    try {
        const formasPagamento = await knex('formas_pagamento')
            .select('id', 'nome') // Seleciona apenas os campos necessários
            .where({ soft_delete: false });

        const formasPagamentoMap = new Map(formasPagamento.map(({ id, nome }) => [id, nome]));

        await Promise.all(lista_pagamentos.map(async ({ pagamento_id, valor_pago, parcelamento }) => {
            if (formasPagamentoMap.has(pagamento_id)) {
                const formaPagamento = {
                    forma_pagamento_id: pagamento_id,
                    venda_id,
                    valor_pago,
                    parcelamento
                };
                await knex('vendas_formas_pagamento').insert(formaPagamento);
            }
        }));

        return { validador: true };
    } catch (error) {
        return {
            validador: false,
            mensagem: error.message
        };
    }
};


module.exports = formasDePagamento