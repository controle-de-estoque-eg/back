const express = require('express')
require('dotenv').config()
const cors = require('cors');
const app = express()

app.use(cors());

app.use(express.json())

app.listen(3000, () =>
    console.log("Servidor iniciado com sucesso!")
);

