const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const rotas = require('./rotas')

app.use(cors())
app.use(express.json())
app.use(rotas)

const port = process.env.PORT || 3001
app.listen(3001, () => {
  console.log(`API rodando em: http://localhost:${port}`)
})
