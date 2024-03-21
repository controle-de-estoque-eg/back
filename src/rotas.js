const express = require("express")
const rotas = express.Router()

//multer
const upload = require("./multerConfig")

//autenticacao
const autenticacao = require("./Intermediarios/autenticacao")

//Roles
const { cadatroRotes, listarRotes, deleteRotes } = require("./Controladores/rotes")

//Usuarios 
const { listarUsuarios, listarUsuario, cadastrarUsuario, editararUsuario, excluirUsuario } = require("./Controladores/usuarios")

//login
const login = require("./Controladores/login")

//Categorias
const { listarCategorias, listarCategoria, cadastrarCategoria, editararCategoria, excluirCategoria } = require("./Controladores/categoria")

//Cliente
const { cadastrarcliente, listarclientes, listarcliente, editararcliente, excluircliente } = require("./Controladores/cliente")

//Fornecedores
const { cadastrarfornecedor, listarfornecedores, listarfornecedor, editararfornecedor, excluirfornecedor } = require("./Controladores/fornecedor")

//Produtos_Fornecedores
const { cadastraProdutos_Fornecedores, exlcuirProdutos_Fornecedores, listarProdutos_fornecedores, listarProdutos_fornecedor } = require("./Controladores/produtos_fornecedores")

//Formas-pagemento
const { listarformas_pagemento, listarforma_pagemento, cadastrarformas_pagemento, editararformas_pagemento, excluirformas_pagemento } = require("./Controladores/formas-pagemento")

//Produto
const { cadastroProduto, editarProduto, listarProdutos, listarProduto, excluirProduto } = require('./Controladores/produto')

//Vendas
const { cadastrarVenda, listarVenda, listarVendas, excluirVenda } = require('./Controladores/vendas')

//Pedidos
const { cadastrarPedido, listarPedido, listarPedidos, excluirPedido } = require('./Controladores/pedidos')

const { cadastrarEstoque, listarEstoques, listarEstoque, excluirEstoque } = require('./Controladores/estoque')

//relatorio-vendas
const relatorioVendas = require('./Controladores/relatorios/relatoriosVendas')

//relatorio-produtos
const produtosEmDestaque = require('./Controladores/relatorios/relatoriosProdutos')

//relatorio-lucro
const relatorioLucro = require('./Controladores/relatorios/relatoriosLucro')

//relatorio-Estoque
const relatorioEstoque = require('./Controladores/relatorios/relatoriosEstoque')

//relatorio-Pagamento
const relatorioPagamento = require('./Controladores/relatorios/relatoriosTipoPg')

//Relatorio-Vendas horario
const vendasHorario = require('./Controladores/relatorios/relatorioVendasHorario')

//Relatorio-vendas-por-cliente
const vendasPorCliente = require('./Controladores/relatorios/relattoriovendasPorCliente')

//Relatorio-produtos-categorias
const relatorioProCat = require('./Controladores/relatorios/relatorioProdutosCategorias')

//Relatorio-Vendas-Fornecedores
const relatorioFornecedores = require('./Controladores/relatorios/relatorioFornecedores')

//Relatorio-Vendas-Usuario
const relatorioVendasPorUsuario = require('./Controladores/relatorios/relatorioVendasPorUsuario')


//Alerta-Produtos-Estoque-baixo
const alertaEstoque = require('./Controladores/alerta/alertaEstoque')
//---------------------------Rotas--------------------------------------

//Rotas-Roles
rotas.get('/roles', listarRotes)
rotas.post('/roles', cadatroRotes)
rotas.delete('/roles/:id', deleteRotes);

//login
rotas.post('/login', login)
rotas.post('/usuario', cadastrarUsuario)
//Autenticação JWT
rotas.use(autenticacao);

//Rotas Protegidas por token -----------------------------------

//Rotas-Usuarios
rotas.get('/usuario', listarUsuarios)
rotas.get('/usuario/:id', listarUsuario)
rotas.put('/usuario/:id', editararUsuario)
rotas.delete('/usuario/:id', excluirUsuario)

//Rotas-Categorias
rotas.post('/categoria', cadastrarCategoria)
rotas.get('/categoria', listarCategorias)
rotas.get('/categoria/:id', listarCategoria)
rotas.put('/categoria/:id', editararCategoria)
rotas.delete('/categoria/:id', excluirCategoria)

//Rotas-Clientes
rotas.post('/cliente', cadastrarcliente)
rotas.get('/cliente', listarclientes)
rotas.get('/cliente/:id', listarcliente)
rotas.put('/cliente/:id', editararcliente)
rotas.delete('/cliente/:id', excluircliente)

//Rotas-Fornecedor
rotas.post('/fornecedor', cadastrarfornecedor)
rotas.get('/fornecedor', listarfornecedores)
rotas.get('/fornecedor/:id', listarfornecedor)
rotas.put('/fornecedor/:id', editararfornecedor)
rotas.delete('/fornecedor/:id', excluirfornecedor)

//Rotas-Fornecedor_produto
rotas.post('/produtos_fornecedores', cadastraProdutos_Fornecedores)
rotas.get('/produtos_fornecedores/', listarProdutos_fornecedores)
rotas.get('/produtos_fornecedores/:id', listarProdutos_fornecedor)
rotas.delete('/produtos_fornecedores/:id', exlcuirProdutos_Fornecedores)

//Rotas-Formas_Pagamento
rotas.post('/formas-pagemento', cadastrarformas_pagemento)
rotas.get('/formas-pagemento', listarformas_pagemento)
rotas.get('/formas-pagemento/:id', listarforma_pagemento)
rotas.put('/formas-pagemento/:id', editararformas_pagemento)
rotas.delete('/formas-pagemento/:id', excluirformas_pagemento)

//Rotas-Produto
rotas.post('/produto', upload.single('file'), cadastroProduto)
rotas.get('/produto', listarProdutos)
rotas.get('/produto/:id', listarProduto)
rotas.put('/produto/:id', editarProduto)
rotas.delete('/produto/:id', excluirProduto)

//Rotas-Vendas
rotas.post('/venda', cadastrarVenda)
rotas.get('/venda', listarVendas)
rotas.get('/venda/:id', listarVenda)
rotas.delete('/venda/:id', excluirVenda)

//Rotas-Pedidos
rotas.post('/pedido', cadastrarPedido)
rotas.get('/pedido', listarPedidos)
rotas.get('/pedido/:id', listarPedido)
rotas.delete('/pedido/:id', excluirPedido)

//Rotas-Estoque
rotas.post('/estoque', cadastrarEstoque)
rotas.get('/estoque', listarEstoques)
rotas.get('/estoque/:id', listarEstoque)
rotas.delete('/estoque/:id', excluirEstoque)

//Rotas---Relatorios-Vendas
rotas.get('/relatorio_vendas', relatorioVendas)

//Rotas---Relatorios-Produtos
rotas.get('/relatorio_produtos', produtosEmDestaque)

//Rotas---Relatorios-Lucro
rotas.get('/relatorio_lucro', relatorioLucro)

//Rotas---Relatorios-Estoque
rotas.get('/relatorio_estoque', relatorioEstoque)

//Rotas---Relatorios-% Pagamentos
rotas.get('/porcentagem-pagamentos', relatorioPagamento)

//Rotas---Relatorios-Venda horarios
rotas.get('/vendas-horario', vendasHorario)

//Rotas---vendas-por-cliente
rotas.get('/vendas-por-cliente', vendasPorCliente)

//Rotas---produtos-categorias
rotas.get('/produtos-categorias', relatorioProCat)

//Rotas---Vendas-Fornecedores
rotas.get('/relatorio-fornecedores', relatorioFornecedores)

//Rotas---Vendas-Fornecedores
rotas.get('/vendas-por-usuario', relatorioVendasPorUsuario)

//Rotas---Produtos-Estoque-baixo
rotas.get('/produtos-estoque-baixo', alertaEstoque)

module.exports = rotas