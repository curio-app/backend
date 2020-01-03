const db = require('../config/db.js');

const getLikesByCollectibleId = id => {
  return db('likes')
    .where({ 'likes.collectibleId': id })
    .join('users', 'likes.userId', 'users.id')
    .select('users.id', 'users.username');
};

const addLike = (collectibleId, userId) => {
  return db('likes')
    .insert({ collectibleId: collectibleId, userId: userId })
    .then(result => getLikesByCollectibleId(collectibleId));
};

const removeLike = (collectibleId, userId) => {
  return db('likes')
    .where({ collectibleId: collectibleId, userId: userId })
    .del()
    .then(result => getLikesByCollectibleId(collectibleId));
};

module.exports = { getLikesByCollectibleId, addLike, removeLike };
