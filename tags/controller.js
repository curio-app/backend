const db = require('../config/db.js');

const getTagsByCollectibleId = id => {
  return db('collectibleTags')
    .where({ 'collectibleTags.collectibleId': id })
    .join('tags', 'collectibleTags.tagId', 'tags.id')
    .select('tags.id', 'tags.name');
};

const getTags = () => {
  return db('tags');
};

module.exports = { getTagsByCollectibleId, getTags };
