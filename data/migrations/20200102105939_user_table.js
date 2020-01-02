exports.up = knex => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table
      .string('email')
      .notNullable()
      .unique();
    table.string('password').notNullable();
    table.string('role');
    table.string('imageUrl', 1000);
    table
      .dateTime('createdAt')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .dateTime('updatedAt')
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('users');
};
