const knex = require('../conexao')

const cadatroRotes = async (req, res) => {
    const { nome } = req.body
    try {
        const roles = await knex("roles").insert({ nome }).returning("*")
        return (
            res.status(200).json(roles)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.detail })
    }
}

const listarRotes = async (req, res) => {

    try {
        const roles = await knex("roles")
        return (
            res.status(200).json(roles)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.detail })
    }
}

const deleteRotes = async (req, res) => {
    const { id } = req.params;
    try {
        const roles = await knex("roles").where({ id }).first()

        if (!roles) {
            return res.status(409).json({
                mensagem:
                    'A roles informado não existe.',
            });
        }

        await knex("roles").where({ id }).update({ soft_delete: true })

        return (
            res.status(200).json({
                mensagem: `A roles ${roles.nome} foi excluida.`
            })
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.detail })
    }
}

module.exports = { cadatroRotes, listarRotes, deleteRotes }