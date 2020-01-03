exports.seed = knex => {
  return knex('tags').insert([{ name: 'lorem' }, { name: 'ipsum' }]);
};
