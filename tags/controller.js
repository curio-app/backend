const db = require('../config/db.js');

const getTags = () => {
  return db('tags');
};

const getTagById = id => {
  return db('tags')
    .where({ id })
    .first();
};

const getTagByName = name => {
  return db('tags')
    .where({ name })
    .first();
};

const addTag = async tag => {
  try {
    const [id] = await db('tags')
      .returning('id')
      .insert(tag);
    return getTagById(id);
  } catch (err) {
    return { error: err };
  }
};

const addTagToCollectible = (collectible_Id, tag_Id) => {
  const newTag = { collectibleId: collectible_Id, tagId: tag_Id };

  return db('collectibleTags')
    .insert(newTag)
    .returning('id')
    .then(result => getTagsByCollectibleId(collectible_Id));
};

const getTagsByCollectibleId = id => {
  return db('collectibleTags')
    .where({ 'collectibleTags.collectibleId': id })
    .join('tags', 'collectibleTags.tagId', 'tags.id')
    .select('tags.id', 'tags.name');
};

const removeTagFromCollectible = (collectible_Id, tag_Id) => {
  return db('collectibleTags')
    .where({ collectibleId: collectible_Id, tagId: tag_Id })
    .del()
    .then(result => getTagsByCollectibleId(collectible_Id));
};

module.exports = {
  getTagsByCollectibleId,
  getTags,
  getTagByName,
  getTagById,
  addTag,
  removeTagFromCollectible,
  addTagToCollectible,
};
