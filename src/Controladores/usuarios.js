const knex = require('../conexao')
const bcrypt = require('bcrypt')
const { DateTime } = require('luxon')

const listarUsuarios = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página atual, padrão para 1 se não for especificada
  const limit = parseInt(req.query.limit) || 10; // Número de itens por página, padrão para 10 se não for especificado

  try {
    const offset = (page - 1) * limit; // Offset para a consulta no banco de dados
    const usuarios = await knex("usuarios")
      .where({ soft_delete: false })
      .offset(offset)
      .limit(limit);

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};


const listarUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await knex('usuarios')
      .where({ id, soft_delete: false })
      .first()

    if (!usuario) {
      return res.status(409).json({
        mensagem: 'A usuario informado não existe.',
      })
    }
    return res.status(200).json(usuario)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, role_id } = req.body

  try {
    const usuarioExistente = await knex('usuarios')
      .where({ email, soft_delete: false })
      .first()

    if (usuarioExistente) {
      return res.status(400).json({
        mensagem:
          'O e-mail informado já está sendo utilizado por outro usuário.',
      })
    }

    const roleIdValida = await knex('roles')
      .where({ id: role_id, soft_delete: false })
      .first()

    if (!roleIdValida) {
      return res.status(400).json({
        mensagem: 'O role_ID não é valido.',
      })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const novoUsuario = await knex('usuarios')
      .insert({
        nome,
        email,
        senha: senhaCriptografada,
        role_id,
      })
      .returning('*')

    const { senha: _, ...usuarioCadastrado } = novoUsuario[0]

    return res.status(201).send(usuarioCadastrado)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

const editararUsuario = async (req, res) => {
  const { nome, email, senha, role_id } = req.body
  const { id } = req.params

  try {
    const usuario = await knex('usuarios')
      .where({ email, soft_delete: false })
      .first()

    if (usuario && usuario.id != id) {
      return res.status(400).json({
        mensagem:
          'O e-mail informado já está sendo utilizado por outro usuário.',
      })
    }

    const roleIdValida = await knex('roles')
      .where({ id: role_id, soft_delete: false })
      .first()

    if (!roleIdValida) {
      return res.status(400).json({
        mensagem: 'O role_ID não é valido.',
      })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const novoUsuario = await knex('usuarios')
      .where({ id })
      .update({
        nome,
        email,
        senha: senhaCriptografada,
        role_id,
        update_at: DateTime.now().setZone('America/Sao_Paulo').toISO(),
      })
      .returning('*')

    const { senha: _, ...usuarioCadastrado } = novoUsuario[0]

    return res.status(201).json(usuarioCadastrado)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

const excluirUsuario = async (req, res) => {
  const { id } = req.params

  try {
    const usuario = await knex('usuarios')
      .where({ id, soft_delete: false })
      .first()

    if (!usuario) {
      return res.status(404).json({ mensagem: 'O usuario não foi encontrado' })
    }

    await knex('usuarios')
      .where({ id })
      .update({
        soft_delete: true,
        delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO(),
      })
      .returning('*')

    return res.status(204).json()
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

module.exports = {
  listarUsuarios,
  listarUsuario,
  cadastrarUsuario,
  editararUsuario,
  excluirUsuario,
}
