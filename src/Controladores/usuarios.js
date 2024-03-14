const knex = require('../conexao')
const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await knex("usuarios")
        return (
            res.status(200).json(usuarios)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.detail })
    }
}

const listarUsuario = async (req, res) => {
    const { id } = req.params
    try {
        const usuario = await knex("usuarios").where({ id }).first()

        if (!usuario) {
            return res.status(409).json({
                mensagem:
                    'A usuario informado não existe.',
            });
        }
        return (
            res.status(200).json(usuario)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.detail })
    }
}

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, role_id } = req.body;

    try {
        const usuarioExistente = await knex('usuarios').where({ email }).first();

        if (usuarioExistente) {
            return res.status(400).json({
                mensagem:
                    'O e-mail informado já está sendo utilizado por outro usuário.',
            });
        }

        const roleIdValida = await knex('roles').where({ id: role_id }).first()

        if (!roleIdValida) {
            return res.status(400).json({
                mensagem:
                    'O role_ID não é valido.',
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada,
                role_id,
                create_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
            })
            .returning('*');

        const { senha: _, ...usuarioCadastrado } = novoUsuario[0];

        return res.status(201).send(usuarioCadastrado);
    } catch (error) {
        return res.status(500).json({ mensagem: error.detail });
    }
};

const editararUsuario = async (req, res) => {
    const { nome, email, senha, role_id } = req.body;
    const { id } = req.params

    try {
        const usuario = await knex('usuarios').where({ email }).first();

        if (usuario && usuario.id != id) {
            return res.status(400).json({
                mensagem:
                    'O e-mail informado já está sendo utilizado por outro usuário.',
            });
        }

        const roleIdValida = await knex('roles').where({ id: role_id }).first()

        if (!roleIdValida) {
            return res.status(400).json({
                mensagem:
                    'O role_ID não é valido.',
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await knex('usuarios')
            .where({ id })
            .update({
                nome,
                email,
                senha: senhaCriptografada,
                role_id,
                update_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
            })
            .returning('*');

        const { senha: _, ...usuarioCadastrado } = novoUsuario[0];

        return res.status(201).json(usuarioCadastrado);
    } catch (error) {
        return res.status(500).json({ mensagem: error.detail });
    }
};

const excluirUsuario = async (req, res) => {
    const { id } = req.params

    try {
        const usuario = await knex('usuarios').where({ id }).first()

        if (!usuario) {
            return res.status(404).json({ mensagem: 'O usuario não foi encontrado' });
        }

        await knex('usuarios').where({ id }).update({
            soft_delete: true,
            delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
        }).returning('*');


        return res.status(204).json()

    } catch (error) {
        return res.status(400).json({ mensagem: error.detail })
    }
}

module.exports = { listarUsuarios, listarUsuario, cadastrarUsuario, editararUsuario, excluirUsuario }