const knex = require('../conexao')
const { DateTime } = require('luxon');

const cadastrarEstoque = async (req, res) => {
}

const listarEstoques = async (req, res) => {
    try {
        const clientes = await knex('clientes').where({ soft_delete: false })

        return (
            res.status(200).json(clientes)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}
const listarEstoque = async (req, res) => {
    const { id } = req.params
    try {
        const cliente = await knex("clientes").where({ id, soft_delete: false }).first()
        if (!cliente) {
            return res.status(409).json({
                mensagem:
                    'O cliente informado não existe.',
            });
        }
        return (
            res.status(200).json(cliente)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}
const editarEstoque = async (req, res) => {
    const { id } = req.params
    const dados = { ...req.body }
    const { email, cpf } = dados
    try {

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}
const excluirEstoque = async (req, res) => {
    const { id } = req.params

    try {
        const cliente = await knex('clientes')
            .where({ id, soft_delete: false })
            .first();


        if (!cliente) {
            return res.status(404).json({ mensagem: 'O cliente não foi encontrado' });
        }

        await knex('clientes').where({ id }).update({
            soft_delete: true,
            delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
        }).returning('*');

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}






module.exports = { cadastrarEstoque, listarEstoques, listarEstoque, editarEstoque, excluirEstoque }