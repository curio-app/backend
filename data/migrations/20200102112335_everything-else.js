exports.up = function(knex) {
  return knex.schema
    .createTable('folders', table => {
      table.increments();
      table.string('name', 128).notNullable();
      table.dateTime('createdAt').defaultTo(knex.fn.now());
      table.dateTime('updatedAt').defaultTo(knex.fn.now());
      table
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    .createTable('collectibles', table => {
      table.increments();
      table.string('name', 128).notNullable();
      table.text('description').notNullable();
      table.text('story');
      table.string('imageUrl', 1000);
      table.boolean('sellable').defaultTo(false);
      table.dateTime('createdAt').defaultTo(knex.fn.now());
      table.dateTime('updatedAt').defaultTo(knex.fn.now());
    })
    .createTable('foldersCollectibles', table => {
      table.increments();
      table
        .integer('folderId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('collectibleId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('collectibles')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    .createTable('likes', table => {
      table.increments();
      table
        .integer('userId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('collectibleId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('collectibles')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    .createTable('tags', table => {
      table.increments();
      table
        .string('name', 128)
        .notNullable()
        .unique();
    })
    .createTable('collectibleTags', table => {
      table.increments();
      table
        .integer('tagId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('collectibleId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('collectibles')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('collectiblesTags')
    .dropTableIfExists('foldersCollectibles')
    .dropTableIfExists('folders')
    .dropTableIfExists('likes')
    .dropTableIfExists('collectibles')
    .dropTableIfExists('tags');
};
