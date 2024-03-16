const knex = require('../conexao')
const { DateTime } = require('luxon')

const listarformas_pagemento = async (req, res) => {
  try {
    const formas_pagamento = await knex('formas_pagamento').where({
      soft_delete: false,
    })
    return res.status(200).json(formas_pagamento)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

const listarforma_pagemento = async (req, res) => {
  const { id } = req.params
  try {
    const formas_pagamento = await knex('formas_pagamento')
      .where({ id, soft_delete: false })
      .first()
    if (!formas_pagamento) {
      return res.status(409).json({
        mensagem: 'A forma de pagamento informado não existe.',
      })
    }
    return res.status(200).json(formas_pagamento)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

const cadastrarformas_pagemento = async (req, res) => {
  const { nome } = req.body
  try {
    const formas_pagamento = await knex('formas_pagamento')
      .where({ nome, soft_delete: false })
      .first()

    if (formas_pagamento) {
      return res.status(400).json({
        mensagem: 'Ja existe uma forma de pagamento com esse nome',
      })
    }
    const novaformas_pagamento = await knex('formas_pagamento')
      .insert({
        nome,
        create_at: DateTime.now().setZone('America/Sao_Paulo').toISO(),
      })
      .returning('*')

    return res.status(201).send(novaformas_pagamento[0])
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

const editararformas_pagemento = async (req, res) => {
  const { nome } = req.body
  const { id } = req.params
  try {
    const formas_pagamentoExiste = await knex('formas_pagamento')
      .where({ id, soft_delete: false })
      .first()

    if (!formas_pagamentoExiste) {
      return res.status(404).json({
        mensagem: 'A forma de pagamento informado não existe.',
      })
    }
    const formas_pagamento = await knex('formas_pagamento')
      .where({ nome, soft_delete: false })
      .first()

    if (formas_pagamento) {
      return res.status(400).json({
        mensagem: 'Ja existe uma forma de pagamento com esse nome',
      })
    }
    const formas_pagamentoAtualizadas = await knex('formas_pagamento')
      .where({ id })
      .update({
        nome,
        update_at: DateTime.now().setZone('America/Sao_Paulo').toISO(),
      })
      .returning('*')

    return res.status(201).send(formas_pagamentoAtualizadas)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

const excluirformas_pagemento = async (req, res) => {
  const { id } = req.params

  try {
    const formas_pagamento = await knex('formas_pagamento')
      .where({ id, soft_delete: false })
      .first()

    if (!formas_pagamento) {
      return res.status(404).json({
        mensagem: 'A forma de pagamento informado não existe.',
      })
    }

    await knex('formas_pagamento')
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
  listarformas_pagemento,
  listarforma_pagemento,
  cadastrarformas_pagemento,
  editararformas_pagemento,
  excluirformas_pagemento,
}
