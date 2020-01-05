const db = require('../config/db.js');

const getLikesByCollectibleId = id => {
  return db('likes')
    .where({ 'likes.collectibleId': id })
    .join('users', 'likes.userId', 'users.id')
    .select('users.id', 'users.username');
};

const addLike = async (collectibleId, userId) => {
  await db('likes').insert({ collectibleId, userId });
  return getLikesByCollectibleId(collectibleId);
};

const removeLike = async (collectibleId, userId) => {
  await db('likes')
    .where({ userId, collectibleId })
    .del();
  return getLikesByCollectibleId(collectibleId);
};

module.exports = { getLikesByCollectibleId, addLike, removeLike };
