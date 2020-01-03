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
  console.log(collectibleId, '< - collectibleId');
  console.lg(userId, '< - userId');
  return db('likes')
    .where({ userId, collectibleId })
    .del()
    .then(result => getLikesByCollectibleId(collectibleId));
};

module.exports = { getLikesByCollectibleId, addLike, removeLike };
