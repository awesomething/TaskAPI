const TodosService = {
  getById(knex, id) {
    return knex.from("todo").select("*").where("id", id).first();
  },

  getTodos(knex) {
    return knex.from("todo").select("*");
  },

  insertTodo(knex, newTodo) {
    return knex
      .insert(newTodo)
      .into("todo")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteTodo(knex, id) {
    return knex("todo").where({ id }).delete();
  },
  updateChecked(knex, id, newTodoFields) {
    return knex("todo").where({ id }).update(newTodoFields);
  },
};

module.exports = TodosService;