exports.seed = knex => {
  const dummyCollectibleTags = [];

  for (let i = 0; i < 50; i += 1) {
    const bool = Math.random() >= 0.5;
    const collectibleId = i + 1;
    if (bool) {
      const newObj = {
        collectibleId,
        tagId: Math.floor(Math.random() * 2) + 1,
      };
      dummyCollectibleTags.push(newObj);
    } else {
      const newObj1 = {
        collectibleId,
        tagId: 1,
      };
      dummyCollectibleTags.push(newObj1);
      const newObj2 = {
        collectibleId,
        tagId: 2,
      };
      dummyCollectibleTags.push(newObj2);
    }
  }

  return knex('collectibleTags').insert(dummyCollectibleTags);
};
