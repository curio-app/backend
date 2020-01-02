const db = require('../config/db.js');

const getAllCollectibles = () => {
  return db('collectibles');
};

const getCollectibleById = id => {
  return db('collectibles')
    .where({ id })
    .first();
};

const addCollectible = async collectible => {
  try {
    const [id] = await db('collectibles')
      .returning('id')
      .insert(collectible);
    return getCollectibleById(id);
  } catch (err) {
    return { error: err.detail };
  }
};

module.exports = { getAllCollectibles, getCollectibleById, addCollectible };
