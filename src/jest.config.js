require('dotenv-safe/config')

const { exec } = require('child_process')

process.env.DB_URL = `${process.env.DB_URL}_testdb02?schema=test_schema`

exec('npm run db:migrate')

module.exports = {}
