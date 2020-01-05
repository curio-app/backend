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
  } catch (error) {
    return { error };
  }
};

const getTagsByCollectibleId = id => {
  return db('collectibleTags')
    .where({ 'collectibleTags.collectibleId': id })
    .join('tags', 'collectibleTags.tagId', 'tags.id')
    .select('tags.id', 'tags.name');
};

const addTagToCollectible = async (collectibleId, tagId) => {
  const newTag = { collectibleId, tagId };

  await db('collectibleTags')
    .insert(newTag)
    .returning('id');

  return getTagsByCollectibleId(collectibleId);
};

const removeTagFromCollectible = async (collectibleId, tagId) => {
  await db('collectibleTags')
    .where({ collectibleId, tagId })
    .del();
  return getTagsByCollectibleId(collectibleId);
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
