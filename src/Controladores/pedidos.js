const knex = require('../conexao');
const { DateTime } = require('luxon');

const validadorProduto = require('../ferramentas/validadorProduto')
const cadastroPedidoProduto = require('../ferramentas/cadastroPedidoProduto')

const calcularValores = require('../ferramentas/calcularValores')

const cadastrarPedido = async (req, res) => {
    const { lista_produtos, ...dados } = req.body;
    const { cliente_id, codigo_de_barras } = dados
    try {

        if (cliente_id) {
            const clienteValido = await knex('clientes').where({ id: cliente_id, soft_delete: false }).first();

            if (!clienteValido) {
                return res.status(400).json({ mensagem: 'Necessário um cliente válido para cadastrar um pedido' });
            }
        }
        const resultadoValidacao = await validadorProduto(lista_produtos)

        if (!resultadoValidacao.validador) {
            return res.status(403).json(resultadoValidacao.mensagem)
        }

        const resultado = await calcularValores(lista_produtos)

        const dadosCompletos = { ...dados, ...resultado }

        const [cadastroPedio] = await knex('pedidos').insert(dadosCompletos).returning('*')

        const { id: pedido_id } = cadastroPedio;

        const pedidoProduto = await cadastroPedidoProduto(pedido_id, lista_produtos);

        if (!pedidoProduto.validador) {
            return res.status(403).json(pedidoProduto.mensagem)
        }

        return res.status(200).json({ mensagem: 'Pedido salvo com sucesso' })
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}

const listarPedido = async (req, res) => {
    const { id } = req.params
    try {
        const pedidos = await knex("pedidos").where({ id, soft_delete: false }).first()
        if (!pedidos) {
            return res.status(409).json({
                mensagem:
                    'O pedido informado não existe.',
            });
        }
        const lista_produtos = await knex('pedidos_produtos').where({ pedido_id: id })

        const resposta = { ...pedidos, lista_produtos }
        return (
            res.status(200).json(resposta)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const listarPedidos = async (req, res) => {
    try {
        const pedidos = await knex('pedidos').where({ soft_delete: false })

        return (
            res.status(200).json(pedidos)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const excluirPedido = async (req, res) => {
    const { id } = req.params;
    try {

        const pedidoExiste = await knex('pedidos')
            .where({ id, soft_delete: false })
            .first();
        if (!pedidoExiste) {
            return res.status(404).json({ mensagem: 'O Pedido não foi encontrado' });
        }

        await knex('pedidos').where({ id }).update({
            soft_delete: true,
            delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
        })

        await knex('pedidos_produtos').where({ pedido_id: id }).update({
            soft_delete: true,
            delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
        })
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }

}

module.exports = { cadastrarPedido, listarPedido, listarPedidos, excluirPedido }