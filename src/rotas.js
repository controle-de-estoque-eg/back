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

//---------------------------Rotas--------------------------------------

//Rotas-Roles
rotas.get('/roles', listarRotes)
rotas.post('/roles', cadatroRotes)
rotas.delete('/roles/:id', deleteRotes);

//login
rotas.post('/login', login)

//Autenticação JWT
rotas.use(autenticacao);

//Rotas Protegidas por token -----------------------------------

//Rotas-Usuarios
rotas.post('/usuario', cadastrarUsuario)
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


module.exports = rotas