
const knex = require('knex')
const app = require('../src/app');

describe('Todo:', function () {
  let db;
  let todos = [
    { "title": "Buy Milk", "categories": "true"},
    { "title": "Do Laundry", "categories": "true"},
    { "title": "Vacuum", "categories": "false"},
    { "title": "Wash Windows", "categories": "false" },
  ]

  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db('todo').truncate());

  afterEach('cleanup', () => db('todo').truncate()); 

  after('disconnect from the database', () => db.destroy()); 

  describe('GET /todos', () => {

    beforeEach('insert some todos', () => {
      return db('todo').insert(todos);
    })

    it('should respond to GET `/todos` with an array of todos and status 200', function () {
      return supertest(app)
        .get('/todos')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(todos.length);
          res.body.forEach((item) => {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'title', 'categories');
          })
        });
    })

  });

  
  describe('GET /todos', () => {

    beforeEach('insert some todos', () => {
      return db('todo').insert(todos);
    })

    it('should return correct todo when given an id', () => {
      let doc;
      return db('todo')
        .first()
        .then(_doc => {
          doc = _doc
          return supertest(app)
            .get(`/todos/${doc.id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'title', 'categories');
          expect(res.body.id).to.equal(doc.id);
          expect(res.body.title).to.equal(doc.title);
          expect(res.body.categories).to.equal(doc.categories);
        });
    })

    it('should respond with a 404 when given an invalid id', () => {
      return supertest(app)
        .get('/todos/1000')
        .expect(404);
    });
    
  });

  
  describe('POST /todos', function () {

    it('should create and return a new todos when provided valid data', function () {
      const newItem = {
        'id': 1,
        'title': 'Do Dishes',
        'categories': 'false'

      };

      return supertest(app)
        .post('/todos')
        .send(newItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'categories');
          expect(res.body.title).to.equal(newItem.title);
          expect(res.body.categories).to.be.false;
          expect(res.headers.location).to.equal(`/todos/${res.body.id}`)
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badItem = {
        foobar: 'broken item'
      };
      return supertest(app)
        .post('/todos')
        .send(badItem)
        .expect(400);
    });

  });


  describe('DELETE /:id', () => {

    beforeEach('insert some todos', () => {
      return db('todo').insert(todos);
    })

    it('should delete an item by id', () => {
      return db('todo')
        .first()
        .then(doc => {
          return supertest(app)
            .delete(`/todos/${doc.id}`)
            .expect(204);
        })
    });

    it('should respond with a 404 for an invalid id', function () {
      
      return supertest(app)
        .delete('/todos')
        .expect(404);
    });

  });

});

