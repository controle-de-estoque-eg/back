const knex = require('../conexao');
const { DateTime } = require('luxon');

const validadorProduto = require('../ferramentas/validadorProduto')
const cadastraVendaProduto = require('../ferramentas/cadastroVendaProduto')
const diminuirEstoque = require('../ferramentas/diminuirEstoque')
const formasDePagamento = require('../ferramentas/formasDePgamento')
const aumentarEstoque = require('../ferramentas/aumentarEstoque')

const calcularValores = require('../ferramentas/calcularValores')

const cadastrarVenda = async (req, res) => {
    const { lista_produtos, lista_pagamentos, ...dados } = req.body;
    const { cliente_id, pedido_id } = dados
    try {

        if (pedido_id) {
            await knex('pedidos').where({ id }).update({
                soft_delete: true,
                delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
            })

            await knex('pedidos_produtos').where({ pedido_id: id }).update({
                soft_delete: true,
                delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
            })
        }
        if (cliente_id) {
            const clienteValido = await knex('clientes').where({ id: cliente_id, soft_delete: false }).first();

            if (!clienteValido) {
                return res.status(400).json({ mensagem: 'Necessário um cliente válido para cadastrar um pedido' });
            }
        }
        const resultadoValidacao = await validadorProduto(lista_produtos)

        if (!resultadoValidacao.validador) {
            return res.status(403).json(resultadoValidacao.mensagem)
        }

        const resultado = await calcularValores(lista_produtos)

        const dadosCompletos = { ...dados, ...resultado }

        const [cadastroVenda] = await knex('vendas').insert(dadosCompletos).returning('*')

        const { id: venda_id } = cadastroVenda;

        const pedidoProduto = await cadastraVendaProduto(venda_id, lista_produtos);
        if (!pedidoProduto.validador) {
            return res.status(403).json(pedidoProduto.mensagem)
        }

        const cadastroPagamento = await formasDePagamento(venda_id, lista_pagamentos)

        if (!cadastroPagamento.validador) {
            return res.status(403).json(cadastroPagamento.mensagem)
        }

        const estoque = await diminuirEstoque(lista_produtos);

        if (!estoque.validador) {
            return res.status(403).json(estoque.mensagem)
        }

        return res.status(200).json({ mensagem: 'Pedido cadastrado com sucesso' })
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const listarVenda = async (req, res) => {
    const { id } = req.params
    try {
        const pedidos = await knex("vendas").where({ id, soft_delete: false }).first()
        if (!pedidos) {
            return res.status(409).json({
                mensagem:
                    'A venda informado não existe.',
            });
        }
        const lista_produtos = await knex('vendas_produtos').where({ venda_id: id, soft_delete: false })

        const resposta = { ...pedidos, lista_produtos }
        return (
            res.status(200).json(resposta)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const listarVendas = async (req, res) => {
    try {
        const vendas = await knex('vendas').where({ soft_delete: false })

        return (
            res.status(200).json(vendas)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const excluirVenda = async (req, res) => {
    const { id } = req.params;
    try {
        // Iniciar uma transação
        await knex.transaction(async (trx) => {
            const venda = await knex('vendas').where({ id, soft_delete: false }).first().transacting(trx);

            if (!venda) {
                return res.status(400).json({ mensagem: 'Venda não encontrada ou já excluída.' });
            }

            // Atualizar formas de pagamento
            await knex('vendas_formas_pagamento').where({ venda_id: id, soft_delete: false }).update({ soft_delete: true, delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO() }).transacting(trx);

            // Obter lista de produtos da venda
            const lista_produtos = await knex('vendas_produtos').where({ venda_id: id, soft_delete: false }).transacting(trx);

            // Atualizar estoque dos produtos
            const retornaEstoque = await aumentarEstoque(lista_produtos);

            if (!retornaEstoque.validador) {
                return res.status(403).json(retornaEstoque.mensagem);
            }

            // Marcar produtos e venda como excluídos
            await knex('vendas_produtos').where({ venda_id: id, soft_delete: false }).update({ soft_delete: true, delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO() }).transacting(trx);
            await knex('vendas').where({ id, soft_delete: false }).update({ soft_delete: true, delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO() }).transacting(trx);

            // Commit da transação se tudo ocorrer bem
            await trx.commit();
        });

        return res.status(200).json();
    } catch (error) {
        // Rollback da transação em caso de erro
        return res.status(500).json({ mensagem: error.message });
    }
};


module.exports = { cadastrarVenda, listarVenda, listarVendas, excluirVenda }