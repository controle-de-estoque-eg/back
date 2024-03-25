const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '159753',
    database: 'pdv',
    port: '5432',
  },
})

module.exports = knex
