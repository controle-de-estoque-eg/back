const express = require("express")
const rotas = express.Router()

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


module.exports = rotas