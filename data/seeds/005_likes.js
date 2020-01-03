exports.seed = knex => {
  const dummyLikes = [];

  for (let i = 0; i < 50; i += 1) {
    const bool = Math.random() >= 0.5;
    const collectibleId = i + 1;
    if (bool) {
      const newObj = {
        collectibleId,
        userId: Math.floor(Math.random() * 2) + 1,
      };
      dummyLikes.push(newObj);
    } else {
      const newObj1 = {
        collectibleId,
        userId: 1,
      };
      dummyLikes.push(newObj1);
      const newObj2 = {
        collectibleId,
        userId: 2,
      };
      dummyLikes.push(newObj2);
    }
  }

  return knex('likes').insert(dummyLikes);
};
