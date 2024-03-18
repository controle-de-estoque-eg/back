const knex = require('../conexao')
const { DateTime } = require('luxon');

const cadastrarEstoqueProduto = require("../ferramentas/cadastrarEstoque")
const aumentarEstoque = require("../ferramentas/aumentarEstoque")
const diminuirEstoque = require("../ferramentas/diminuirEstoque")

const cadastrarEstoque = async (req, res) => {
    const { lista_produtos, ...dados } = req.body;
    const { fornecedor_id, tipo } = dados
    try {
        if (fornecedor_id) {
            const fornecedor = await knex('fornecedores').where({ id: fornecedor_id, soft_delete: false }).first();

            if (!fornecedor) {
                return res.status(400).json({ mensagem: 'Necessário um fornecedor válido para cadastrar um pedido' });
            }
        }
        const [cadastroEstoque] = await knex('movimento_estoque').insert(dados).returning('*')

        const { id: movimento_estoque_id } = cadastroEstoque;

        const pedidoProduto = await cadastrarEstoqueProduto(movimento_estoque_id, lista_produtos);

        if (!pedidoProduto.validador) {
            return res.status(403).json(pedidoProduto.mensagem)
        }

        if (tipo === "entrada") {
            const estoque = await aumentarEstoque(lista_produtos);

            if (!estoque.validador) {
                return res.status(403).json(estoque.mensagem)
            }
        } else {
            const estoque = await diminuirEstoque(lista_produtos);

            if (!estoque.validador) {
                return res.status(403).json(estoque.mensagem)
            }
        }

        return res.status(200).json({ mensagem: 'Estoque cadastrado com sucesso' })
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const listarEstoques = async (req, res) => {
    try {
        const estoques = await knex('movimento_estoque').where({ soft_delete: false })

        return (
            res.status(200).json(estoques)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const listarEstoque = async (req, res) => {
    const { id } = req.params
    try {
        const estoque = await knex("movimento_estoque").where({ id, soft_delete: false }).first()
        if (!estoque) {
            return res.status(409).json({
                mensagem:
                    'O Movimento de estoque informado não existe.',
            });
        }
        const lista_produtos = await knex('produto_movimento_estoque').where({ movimento_estoque_id: id, soft_delete: false })

        const resposta = { ...estoque, lista_produtos }
        return (
            res.status(200).json(resposta)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const excluirEstoque = async (req, res) => {
    const { id } = req.params
    try {
        // Iniciar uma transação
        await knex.transaction(async (trx) => {
            const movimentacao = await knex('movimento_estoque').where({ id, soft_delete: false }).first()

            if (!movimentacao) {
                return res.status(400).json({ mensagem: 'A movimentação de estoque foi não encontrada ou já excluída.' });
            }

            // Obter lista de produtos da venda
            const lista_produtos = await knex('produto_movimento_estoque').where({ movimento_estoque_id: id, soft_delete: false })

            if (movimentacao.tipo === "entrada") {
                const estoque = await diminuirEstoque(lista_produtos);

                if (!estoque.validador) {
                    return res.status(403).json(estoque.mensagem)
                }
            } else {
                const estoque = await aumentarEstoque(lista_produtos);
                if (!estoque.validador) {
                    return res.status(403).json(estoque.mensagem)
                }
            }
            // Marcar produtos e venda como excluídos
            await knex('produto_movimento_estoque').where({ movimento_estoque_id: id, soft_delete: false }).update({ soft_delete: true })

            await knex('movimento_estoque').where({ id, soft_delete: false }).update({ soft_delete: true })
        });

        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}






module.exports = { cadastrarEstoque, listarEstoques, listarEstoque, excluirEstoque }