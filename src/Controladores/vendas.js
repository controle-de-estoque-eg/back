const knex = require('../conexao');
const { DateTime } = require('luxon');

const validadorProduto = require('../ferramentas/validadorProduto')
const cadastraVendaProduto = require('../ferramentas/cadastroVendaProduto')
const ajustaEstoque = require('../ferramentas/ajustarEstoque')
const formasDePagamento = require('../ferramentas/formasDePgamento')

const cadastrarVenda = async (req, res) => {
    const { lista_produtos, lista_pagamentos, ...dados } = req.body;
    const { cliente_id } = dados
    try {

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

        const [cadastroVenda] = await knex('vendas').insert(dados).returning('*')

        const { id: venda_id } = cadastroVenda;

        const pedidoProduto = await cadastraVendaProduto(venda_id, lista_produtos);
        if (!pedidoProduto.validador) {
            return res.status(403).json(pedidoProduto.mensagem)
        }

        const cadastroPagamento = await formasDePagamento(venda_id, lista_pagamentos)

        if (!cadastroPagamento.validador) {
            return res.status(403).json(cadastroPagamento.mensagem)
        }

        const estoque = await ajustaEstoque(lista_produtos);

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
        const venda = await knex("vendas").where({ id, soft_delete: false }).first()
        if (!venda) {
            return res.status(409).json({
                mensagem:
                    'a venda informado não existe.',
            });
        }
        return (
            res.status(200).json(venda)
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

const editarVenda = async (req, res) => {
}

const excluirVenda = async (req, res) => {
}

module.exports = { cadastrarVenda, listarVenda, listarVendas, editarVenda, excluirVenda }