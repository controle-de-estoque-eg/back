const knex = require('../conexao')
const { DateTime } = require('luxon');

const cadastrarcliente = async (req, res) => {
    const dados = { ...req.body }
    const { email, cpf } = dados
    try {
        const emailExistente = await knex('clientes').where({ email, soft_delete: false }).first();

        if (emailExistente) {
            return res.status(409).json({
                mensagem:
                    'O e-mail informado já está sendo utilizado por outro cliente.',
            });
        }
        const cpfExistente = await knex('clientes').where({ cpf, soft_delete: false }).first();
        if (cpfExistente) {
            return res.status(409).json({
                mensagem:
                    'O cpf informado já está sendo utilizado por outro cliente.',
            });
        }
        const novoCliente = await knex("clientes").insert(dados).returning("*")
        return res.status(201).json(novoCliente);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const listarclientes = async (req, res) => {
    try {
        const clientes = await knex('clientes').where({ soft_delete: false })

        return (
            res.status(200).json(clientes)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}
const listarcliente = async (req, res) => {
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
const editararcliente = async (req, res) => {
    const { id } = req.params
    const dados = { ...req.body }
    const { email, cpf } = dados
    try {
        const cliente = await knex('clientes').where({ id, soft_delete: false }).first();

        if (!cliente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        if (email) {
            const emailExistente = await knex('clientes').where({ email, soft_delete: false }).first();

            if (emailExistente && emailExistente.id != id) {
                return res.status(409).json({
                    mensagem:
                        'O e-mail informado já está sendo utilizado por outro cliente.',
                });
            }
        }

        if (cpf) {
            const cpfExistente = await knex('clientes').where({ cpf, soft_delete: false }).first();

            if (cpfExistente && cpfExistente.id != id) {
                return res.status(400).json({
                    mensagem:
                        'O cpf informado já está sendo utilizado por outro cliente.',
                });
            }
        }
        const dadosCompletos = { ...dados, update_at: DateTime.now().setZone('America/Sao_Paulo').toISO() }
        const clienteAtualizado = await knex("clientes").where({ id }).update(dadosCompletos).returning("*")
        return res.status(200).json(clienteAtualizado);

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}
const excluircliente = async (req, res) => {
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






module.exports = { cadastrarcliente, listarclientes, listarcliente, editararcliente, excluircliente }