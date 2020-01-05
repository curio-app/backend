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
      'users.username',
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

const getLatest = async () => {
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
      'users.username',
      'users.id as userId'
    )
    .orderBy('collectibles.createdAt', 'desc')
    .limit(20);
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

const getCollectibleById = async id => {
  const collectible = await db('collectibles')
    .where({ 'collectibles.id': id })
    .join(
      'foldersCollectibles',
      'collectibles.id',
      'foldersCollectibles.collectibleId'
    )
    .join('folders', 'foldersCollectibles.folderId', 'folders.id')
    .join('users', 'folders.userId', 'users.id')
    .select(
      'collectibles.id',
      'collectibles.name',
      'collectibles.description',
      'collectibles.story',
      'collectibles.sellable',
      'collectibles.imageUrl',
      'users.username',
      'users.imageUrl as userImageUrl',
      'users.id as userId'
    )
    .first();
  const likes = await getLikesByCollectibleId(collectible.id);
  const tags = await getTagsByCollectibleId(collectible.id);
  return {
    ...collectible,
    likes,
    tags,
  };
};

const addCollectible = async (collectible, folderId) => {
  try {
    const [id] = await db('collectibles')
      .returning('id')
      .insert(collectible);
    await db('foldersCollectibles')
      .returning('id')
      .insert({
        folderId,
        collectibleId: id,
      });
    return getCollectibleById(id);
  } catch (err) {
    return { error: err.detail };
  }
};

const deleteCollectible = async collectibleId => {
  await db('foldersCollectibles ')
    .where({ collectibleId })
    .del();
  await db('likes')
    .where({ collectibleId })
    .del();
  await db('collectibleTags')
    .where({ collectibleId })
    .del();
  return db('collectibles')
    .where({ id: collectibleId })
    .del();
};

module.exports = {
  getAllCollectibles,
  getCollectibleById,
  addCollectible,
  getLatest,
  deleteCollectible,
};
