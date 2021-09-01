const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port: process.env.DB_PORT,
    password : process.env.DB_PASSWORD,
    database : 'db_voca'
  }
});

module.exports = knex;