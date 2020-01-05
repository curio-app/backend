exports.seed = knex => {
  return knex('folders').insert([
    { name: 'All', userId: 1 },
    { name: 'All', userId: 2 },
  ]);
};
