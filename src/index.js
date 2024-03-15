const express = require('express')
require('dotenv').config()
const cors = require('cors');
const app = express()
const rotas = require("./rotas")

app.use(cors());
app.use(express.json())
app.use(rotas)

const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`API rodando em: http://localhost:${port}`)
});

