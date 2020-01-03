const db = require('../config/db.js');

const { getTagsByCollectibleId } = require('../tags/controller.js');
const { getLikesByCollectibleId } = require('../likes/controller.js');

const getAllCollectibles = async () => {
  const collectibles = await db('folders')
    .where({ 'folders.name': 'All' })
    .join('users', 'folders.userId', 'users.id')
    .join('foldersCollectibles', 'folders.id', 'foldersCollectibles.folderId')
    .join(
      'collectibles',
      'foldersCollectibles.collectibleId',
      'collectibles.id'
    )
    .select(
      'collectibles.id as id',
      'collectibles.name',
      'collectibles.createdAt',
      'collectibles.updatedAt',
      'collectibles.imageUrl',
      'collectibles.story',
      'collectibles.description',
      'collectibles.sellable',
      'folders.id as folderId',
      'users.email',
      'users.id as userId'
    );
  const full = collectibles.map(async coll => {
    const likes = await getLikesByCollectibleId(coll.id);
    const tags = await getTagsByCollectibleId(coll.id);
    return {
      ...coll,
      likes,
      tags,
    };
  });
  const results = await Promise.all(full);
  return results;
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
