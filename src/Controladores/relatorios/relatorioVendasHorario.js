const knex = require("../../conexao");

const vendasHorario = async (req, res) => {
    const periodoInicio = new Date(req.body.periodoInicio);
    const periodoFim = new Date(req.body.periodoFim);
    const resultados = [];

    try {
        // Itera por cada hora do período
        for (let hora = new Date(periodoInicio); hora <= periodoFim; hora.setHours(hora.getHours() + 1)) {
            const result = await knex('vendas')
                .select(
                    knex.raw('DATE_TRUNC(\'hour\', create_at) as hora'),
                    knex.raw('SUM(valor_venda) as total_vendas')
                )
                .where('create_at', '>=', hora)
                .where('create_at', '<', new Date(hora.getTime() + 3600000)) // Próxima hora
                .where('soft_delete', false)
                .groupBy(knex.raw('DATE_TRUNC(\'hour\', create_at)'))
                .orderBy('hora');

            let formattedHora = hora.getHours().toString().padStart(2, '0') + ':00'; // Formato "00:00" a "24:00"

            // Adiciona o resultado da consulta ao array de resultados
            resultados.push({ hora: formattedHora, total_vendas: result.length > 0 ? result[0].total_vendas : 0 });
        }

        return res.status(200).json(resultados);

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

module.exports = vendasHorario;





