require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')
const app = express()
const TodosRouter = require('./todos/todos-router')

const {CLIENT_ORIGIN} = require('./config');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/todos', TodosRouter)

app.use(
    cors({
      origin: '*'
    })
);

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}))

app.get("/api", (req, res) => {
  res.send("Hello, world!");
});

app.use(helmet())

app.use(express.static('public'))


app.use(errorHandler)



module.exports = app