const express = require("express")
const TodosService = require('./todos-service')
const xss = require('xss')
const jsonParser = express.json()
const path = require('path')
const logger = require("../logger")

const todosRouter = express.Router();

const serializeTodo = (todos) => {
  return {
    categories: todos.categories,
    title: xss(todos.title),
    id: todos.id,
  };
};



todosRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TodosService.getTodos(knexInstance)
      .then(todos => {
        res.json(todos.map(serializeTodo))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {
      title,
      categories,

    } = req.body;
    const newTodo = {
      title,

    };

    for (const [key, value] of Object.entries(newTodo))
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }

    //newTodo.completed = completed;  

    TodosService.insertTodo(
      req.app.get('db'),
      newTodo
    )
      .then(todo => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${todo.id}`))
          .json(serializeTodo(todo));
      })
        .catch(next)
      
  });

todosRouter
  .route('/:id')
  .all((req, res, next) => {

    TodosService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(todo => {
        if (!todo) {
          return res.status(404).json({
            error: { message: `Todo doesn't exist` },
          });
        }
        res.todo = todo;
        next();
      })
      .catch(next)

  })
  .get((req, res, next) => {
    res.json(serializeTodo(res.todo))
  })
  .delete((req, res, next) => {
    TodosService.deleteTodo(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      categories,
      title,
      checked,
      category_id, } = req.body;
    const todoToUpdate = {
      categories,
      title,
      checked,
      category_id,
    }

    const numberOfValues = Object.values(todoToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      logger.error(`Invalid update without required fields`);
    return res.status(400).json({
      error: {
        message: `Request body must content either 'title' or 'completed'`
      },
    })


  })


module.exports = todosRouter;

