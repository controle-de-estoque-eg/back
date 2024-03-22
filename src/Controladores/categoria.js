const knex = require('../conexao')
const { DateTime } = require('luxon')

const listarCategorias = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página atual, padrão para 1 se não for especificada
  const limit = parseInt(req.query.limit) || 10; // Número de itens por página, padrão para 10 se não for especificado

  try {
    const offset = (page - 1) * limit; // Offset para a consulta no banco de dados
    const categorias = await knex('categorias')
      .where({ soft_delete: false })
      .offset(offset)
      .limit(limit);

    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
}
const listarCategoria = async (req, res) => {
  const { id } = req.params
  try {
    const categoria = await knex('categorias')
      .where({ id, soft_delete: false })
      .first()
    if (!categoria) {
      return res.status(409).json({
        mensagem: 'A categoria informado não existe.',
      })
    }
    return res.status(200).json(categoria)
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}
const cadastrarCategoria = async (req, res) => {
  const { nome, descricao } = req.body
  try {
    const categoriaExiste = await knex('categorias')
      .where({ nome, soft_delete: false })
      .first()
    if (categoriaExiste) {
      return res.status(400).json({
        mensagem: 'Ja existe uma categoria com esse nome',
      })
    }
    const novaCategoria = await knex('categorias')
      .insert({ nome, descricao })
      .returning('*')

    return res.status(201).send(novaCategoria[0])
  } catch (error) {
    return res.status(500).json({ mensagem: error })
  }
}
const editararCategoria = async (req, res) => {
  const { nome, descricao } = req.body
  const { id } = req.params
  try {
    const categoriaExiste = await knex('categorias')
      .where({ nome, soft_delete: false })
      .first()

    if (categoriaExiste) {
      return res.status(400).json({
        mensagem: 'Ja existe uma categoria com esse nome',
      })
    }
    const categoriasAtualizadas = await knex('categorias')
      .where({ id })
      .update({
        nome,
        descricao,
        update_at: DateTime.now().setZone('America/Sao_Paulo').toISO(),
      })
      .returning('*')

    return res.status(201).send(categoriasAtualizadas[0])
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}
const excluirCategoria = async (req, res) => {
  const { id } = req.params

  try {
    const categoriaExiste = await knex('categorias')
      .where({ id, soft_delete: false })
      .first()

    if (!categoriaExiste) {
      return res
        .status(404)
        .json({ mensagem: 'A Cateogira não foi encontrado' })
    }

    await knex('categorias')
      .where({ id })
      .update({
        soft_delete: true,
        delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO(),
      })

    return res.status(204).json()
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

module.exports = {
  listarCategorias,
  listarCategoria,
  cadastrarCategoria,
  editararCategoria,
  excluirCategoria,
}
