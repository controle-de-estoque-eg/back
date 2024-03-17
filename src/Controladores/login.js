const knex = require('../conexao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const senhaJwt = process.env.SENHA_JWT

const login = async (req, res) => {
  const { email, senha } = req.body
  try {
    const usuarioComRole = await knex('usuarios')
      .select('usuarios.*', 'roles.nome as role_nome')
      .where({ 'usuarios.email': email, 'usuarios.soft_delete': false })
      .join('roles', 'usuarios.role_id', '=', 'roles.id')
      .first()

    if (!usuarioComRole) {
      return res
        .status(404)
        .json({ mensagem: 'Esse email não esta cadastrado no sistema' })
    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioComRole.senha)

    if (!senhaCorreta) {
      return res.status(404).json({ mensagem: 'Email ou senha não confere' })
    }
    const token = jwt.sign(
      {
        id: usuarioComRole.id,
        nome: usuarioComRole.nome,
        email: usuarioComRole.email,
        roles: usuarioComRole.role_nome,
      },
      senhaJwt,
      { expiresIn: '8h' }
    )

    return res.status(200).json({ token })
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
}

module.exports = login
