const express = require('express')
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")
require('dotenv').config()
const cors = require('cors');
const app = express()

app.use(cors());

app.use(express.json())

// teste swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Teste',
      version: '1.0.0',
    },
  },
  apis: ['./src/index.js'],
};

const swaggerDocs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))

/**
 * @openapi
 * /teste:
 *   get:
 *     description: Teste
 *     responses:
 *       200:
 *         description: retorna lista de teste
 */
app.get("/teste", (req, res) => { 
  res.send([
    {
      id: 1,
      nome: "Teste 1"
    },
    {
      id: 2,
      nome: "Teste 2"
    },
  ])
})

/**
 * @openapi
 * /teste:
 *   post:
 *     description: Cria um objeto teste
 *     parameters:
 *     - name: nome
 *       description: Nome do teste
 *       in: formData
 *       required: true
 *       type: string
 *     responses:
 *       201:
 *         description: OBJ criado
 */
app.post("/teste", (req, res) => { 
  res.status(201).send()
})

// teste swagger

const port = process.env.PORT || 3000;
app.listen(3000, () => { 
    console.log(`API rodando em: http://localhost:${port}`)
    console.log(`Docs rodando em: http://localhost:${port}/api-docs`)
});

