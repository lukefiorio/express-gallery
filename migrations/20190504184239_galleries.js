exports.up = function(knex, Promise) {
  return knex.schema.createTable('galleries', (table) => {
    table.increments();
    table.text('author').notNull();
    table.text('link').notNull();
    table.text('description').notNull();
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('galleries');
};
