const knex = require('../conexao')
const { DateTime } = require('luxon')


const listarfornecedores = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página atual, padrão para 1 se não for especificada
  const limit = parseInt(req.query.limit) || 10; // Número de itens por página, padrão para 10 se não for especificado

  try {
    const offset = (page - 1) * limit; // Offset para a consulta no banco de dados
    const fornecedores = await knex('fornecedores')
      .where({ soft_delete: false })
      .offset(offset)
      .limit(limit);

    return res.status(200).json(fornecedores);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
}
const listarfornecedor = async (req, res) => {
  const { id } = req.params
  try {
    const fornecedor = await knex('fornecedores')
      .where({ id, soft_delete: false })
      .first()
    if (!fornecedor) {
      return res.status(409).json({
        mensagem: 'O fornecedor informado não existe.',
      })
    }
    return res.status(200).json(fornecedor)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}
const cadastrarfornecedor = async (req, res) => {
  const dados = { ...req.body }
  const { nome, email, documento, telefone } = dados
  try {
    const nomeExistente = await knex('fornecedores')
      .where({ nome, soft_delete: false })
      .first()

    if (nomeExistente) {
      return res.status(409).json({
        mensagem:
          'O nome informado já está sendo utilizado por outro fornecedor.',
      })
    }

    const emailExistente = await knex('fornecedores')
      .where({ email, soft_delete: false })
      .first()

    if (emailExistente) {
      return res.status(409).json({
        mensagem:
          'O e-mail informado já está sendo utilizado por outro fornecedor.',
      })
    }

    const documentoExistente = await knex('fornecedores')
      .where({ documento, soft_delete: false })
      .first()

    if (documentoExistente) {
      return res.status(409).json({
        mensagem:
          'O documento informado já está sendo utilizado por outro fornecedor.',
      })
    }

    const telefoneExistente = await knex('fornecedores')
      .where({ telefone, soft_delete: false })
      .first()

    if (telefoneExistente) {
      return res.status(409).json({
        mensagem:
          'O telefone informado já está sendo utilizado por outro fornecedor.',
      })
    }

    const novofornecedor = await knex('fornecedores')
      .insert(dados)
      .returning('*')

    return res.status(201).json(novofornecedor[0])
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}
const editararfornecedor = async (req, res) => {
  const { id } = req.params
  const dados = { ...req.body }
  const { nome, email, documento, telefone } = dados

  try {
    const fornecedor = await knex('fornecedores')
      .where({ id, soft_delete: false })
      .first()

    if (!fornecedor) {
      return res
        .status(404)
        .json({ mensagem: 'O fornecedor informado não existe.' })
    }
    if (nome) {
      const nomeExistente = await knex('fornecedores')
        .where({ nome, soft_delete: false })
        .first()

      if (nomeExistente) {
        return res.status(409).json({
          mensagem:
            'O nome informado já está sendo utilizado por outro fornecedor.',
        })
      }
    }
    if (email) {
      const emailExistente = await knex('fornecedores')
        .where({ email, soft_delete: false })
        .first()

      if (emailExistente) {
        return res.status(409).json({
          mensagem:
            'O e-mail informado já está sendo utilizado por outro fornecedor.',
        })
      }
    }
    if (documento) {
      const documentoExistente = await knex('fornecedores')
        .where({ documento })
        .first()

      if (documentoExistente) {
        return res.status(409).json({
          mensagem:
            'O documento informado já está sendo utilizado por outro fornecedor.',
        })
      }
    }

    if (telefone) {
      const telefoneExistente = await knex('fornecedores')
        .where({ telefone, soft_delete: false })
        .first()

      if (telefoneExistente) {
        return res.status(409).json({
          mensagem:
            'O telefone informado já está sendo utilizado por outro fornecedor.',
        })
      }
    }

    const dadosCompletos = {
      ...dados,
      update_at: DateTime.now().setZone('America/Sao_Paulo').toISO(),
    }

    const updatefornecedor = await knex('fornecedores')
      .where({ id })
      .update(dadosCompletos)
      .returning('*')

    return res.status(201).json(updatefornecedor[0])
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}
const excluirfornecedor = async (req, res) => {
  const { id } = req.params

  try {
    const fornecedor = await knex('fornecedores')
      .where({ id, soft_delete: false })
      .first()

    if (!fornecedor) {
      return res
        .status(404)
        .json({ mensagem: 'O fornecedor não foi encontrado' })
    }

    await knex('fornecedores')
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
  cadastrarfornecedor,
  listarfornecedores,
  listarfornecedor,
  editararfornecedor,
  excluirfornecedor,
}
