exports.seed = knex => {
  const dummyData = [];

  for (let i = 0; i <= 50; i += 1) {
    const newObj = {
      folderId: Math.floor(Math.random() * 2) + 1,
      collectibleId: i + 1,
    };

    dummyData.push(newObj);
  }

  return knex('foldersCollectibles').insert(dummyData);
};
