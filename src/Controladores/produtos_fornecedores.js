const knex = require('../conexao');
const { DateTime } = require('luxon');

const cadastraProdutos_Fornecedores = async (req, res) => {
    const { lista_produtos, fornecedor_id } = req.body;
    try {
        const fornecedor = await knex('fornecedores').where({ id: fornecedor_id, soft_delete: false }).first();

        if (!fornecedor) {
            return res.status(404).json({ mensagem: 'O fornecedor informado não existe.' });
        }

        const produtosCadastrados = [];

        await Promise.all(lista_produtos.map(async (elemento) => {
            const pedidoProduto = {
                produto_id: elemento.produto_id,
                fornecedor_id
            };
            const produto = await knex('produtos_fornecedores').insert(pedidoProduto).returning("*");
            produtosCadastrados.push(...produto);
        }));

        return res.status(201).json(produtosCadastrados);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const listarProdutos_fornecedores = async (req, res) => {
    try {
        const produtos_fornecedores = await knex('produtos_fornecedores').where({ soft_delete: false });

        if (!produtos_fornecedores || produtos_fornecedores.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum fornecedor tem produtos cadastrados.' });
        }

        const produtosPorFornecedor = produtos_fornecedores.reduce((acc, produto) => {
            const { fornecedor_id } = produto;
            const fornecedorExistente = acc.find(item => item.fornecedor_id === fornecedor_id);
            if (fornecedorExistente) {
                fornecedorExistente.produtos.push(produto);
            } else {
                acc.push({ fornecedor_id, produtos: [produto] });
            }
            return acc;
        }, []);

        return res.status(200).json(produtosPorFornecedor);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const listarProdutos_fornecedor = async (req, res) => {
    const { id } = req.params
    try {
        const produtos_fornecedores = await knex('produtos_fornecedores').where({ fornecedor_id: id, soft_delete: false });

        if (!produtos_fornecedores) {
            return res.status(404).json({ mensagem: 'O fornecedor informado não tem produtos cadastrados.' });
        }
        return (
            res.status(200).json(produtos_fornecedores)
        )
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}


const exlcuirProdutos_Fornecedores = async (req, res) => {
    const { lista_produtos } = req.body;
    const { id } = req.params
    try {
        const fornecedor = await knex('fornecedores').where({ id: fornecedor_id, soft_delete: false }).first();

        if (!fornecedor) {
            return res.status(404).json({ mensagem: 'O fornecedor informado não existe.' });
        }

        const produtosExcluidos = [];
        await Promise.all(lista_produtos.map(async (elemento) => {
            const pedidoProduto = {
                soft_delete: true,
                delete_at: DateTime.now().setZone('America/Sao_Paulo').toISO()
            };
            const produto = await knex('produtos_fornecedores').where({ fornecedor_id: id, produto_id: elemento.produto_id }).update(pedidoProduto).returning("*");
            produtosExcluidos.push(...produto);
        }));

        return res.status(201).json(produtosExcluidos);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }

}

module.exports = { cadastraProdutos_Fornecedores, exlcuirProdutos_Fornecedores, listarProdutos_fornecedores, listarProdutos_fornecedor }