exports.seed = function(knex) {
  const dummyData = [];

  for (let i = 0; i <= 50; i++) {
    const newObj = {
      folderId: Math.floor(Math.random() * 2) + 1,
      collectibleId: i + 1,
    };

    dummyData.push(newObj);
  }

  return knex('foldersCollectibles').insert(dummyData);
};
