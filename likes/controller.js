const db = require('../config/db.js');

const getLikesByCollectibleId = id => {
  return db('likes')
    .where({ 'likes.collectibleId': id })
    .join('users', 'likes.userId', 'users.id')
    .select('users.id', 'users.email');
};

module.exports = { getLikesByCollectibleId };
