const knex = require("../conexao")
const { DateTime } = require('luxon');

const cadastroProduto = async (req, res) => {
    const dados = { ...req.body }
    const { nome, categoria_id, valor_custo, valor_venda } = dados
    try {
        const nomeavalida = await knex('produtos').where({ nome, soft_delete: false }).first()

        if (nomeavalida) {
            return res.status(409).json({
                mensagem:
                    'Ja existe um produto com esse nome'
            });
        }
        const categoriavalida = await knex('categorias').where({ id: categoria_id, soft_delete: false }).first()

        if (!categoriavalida) {
            return res.status(409).json({
                mensagem:
                    'A categoria informado não existe.'
            });
        }
        const dadosCompletos = { ...dados, create_at: DateTime.now().setZone('America/Sao_Paulo').toISO() }

        const novoproduto = await knex('produtos').insert(dadosCompletos).returning("*")

        if (valor_custo) {
            await knex('historico_custo').insert({ produto_id: novoproduto[0].id, valor_custo, update_at: DateTime.now().setZone('America/Sao_Paulo').toISO() })
        }

        if (valor_venda) {
            await knex('historico_venda').insert({ produto_id: novoproduto[0].id, valor_venda, update_at: DateTime.now().setZone('America/Sao_Paulo').toISO() })
        }

        return res.status(201).send(novoproduto[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const editarProduto = async (req, res) => {
    const { id } = req.params
    const dados = { ...req.body }
    const { nome, categoria_id, valor_custo, valor_venda } = dados

    try {
        const produto = await knex("produtos").where({ id, soft_delete: false }).first()

        if (!produto) {
            return res.status(404).json({ mensagem: 'O Produto não foi encontrado' });
        }

        const nomeavalida = await knex('produtos').where({ nome, soft_delete: false }).first()
        if (nomeavalida && nomeavalida.id != id) {
            return res.status(409).json({
                mensagem:
                    'Ja existe um produto com esse nome'
            });
        }
        const categoriavalida = await knex('categorias').where({ id: categoria_id, soft_delete: false }).first()

        if (!categoriavalida) {
            return res.status(409).json({
                mensagem:
                    'A categoria informado não existe.'
            });
        }
        const dadosCompletos = { ...dados, update_at: DateTime.now().setZone('America/Sao_Paulo').toISO() }

        const produtoAtualizado = await knex('produtos').update(dadosCompletos).where({ id }).returning('*')

        if (valor_custo) {
            await knex('historico_custo').insert({ produto_id: produtoAtualizado[0].id, valor_custo, update_at: DateTime.now().setZone('America/Sao_Paulo').toISO() })
        }

        if (valor_venda) {
            await knex('historico_venda').insert({ produto_id: produtoAtualizado[0].id, valor_venda, update_at: DateTime.now().setZone('America/Sao_Paulo').toISO() })
        }

        return res.status(200).json(produtoAtualizado[0])

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const listarProdutos = async (req, res) => {
    try {
        const listaProdutos = await knex("produtos").where({ soft_delete: false })
        return res.status(200).json(listaProdutos)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const listarProduto = async (req, res) => {
    const { id } = req.params
    try {
        const detalharProduto = await knex("produtos").where({ id, soft_delete: false }).first()

        if (!detalharProduto) {
            return res.status(404).json({ mensagem: 'O Produto não foi encontrado' });
        }

        return res.status(200).json(detalharProduto)
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const excluirProduto = async (req, res) => {
    const { id } = req.params
    try {
        const produto = await knex('produtos')
            .where({ id, soft_delete: false })
            .first();


        if (!produto) {
            return res.status(404).json({ mensagem: 'O produto não foi encontrado' });
        }

        await knex('produtos').where({ id }).update({
            soft_delete: true,
            delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
        }).returning('*');

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}


module.exports = { cadastroProduto, editarProduto, listarProdutos, listarProduto, excluirProduto }