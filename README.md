# ThumbTask - API

A task app that helps you take control of your weekly goals!

Live version: (https://thumbtask-awesomething.vercel.app/)

## Introduction 

If you've been dreaming of achieving those goals, but you still have yet to achieve them, what's stopping you? If it's sheer lack of willpower, create your list of goals with ThumbTask and make that dream come to fruition! 

The app separates tasks into 3 main categories: 
* Incompleted 
* Completed
* All

Create tasks that will help you achieve greater goals, or simply create fun things like finishing a series you just haven't gotten around to yet. 

## Technologies

* Node and Express 
  * RESTful API 
* Testing 
  * Supertest (integration) 
  * Mocha and Chai (unit)
* Database 
  * Postgres
  * Knex.js 
  
## Production 

Deployed via Heroku

## API Endpoints
```

### Todos Router
```
- /api/todos
- - GET - gets all todos 
- - POST - creates a new todo 
```

### Todos/:id Router 
```
- /api/todos/:id 
- - GET - gets todo by id 
- - DELETE - deletes a todo by id 
- - PATCH - updates a todo by id 
- - PUT - marks todo complete or incomplete by id 
```

### Categories/:id Router
```
- /api/categories/:id
- - GET - gets categories by id 
```
