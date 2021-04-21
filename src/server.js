require('dotenv').config()
const app = require('./app')
const { PORT, DB_URL } = require('./config')
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: DB_URL
})

app.set('db', db)

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

//const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})








