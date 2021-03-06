const db = require('../config/db.js');

const getFullUserProfile = async username => {
  const user = await db('users')
    .where({ username })
    .select('id', 'username', 'imageUrl')
    .first();
  const folders = await db('folders')
    .where({ userId: user.id })
    .select('id', 'name');
  const completeFolders = folders.map(async folder => {
    const collectiblesInFolder = await db('foldersCollectibles')
      .where({
        folderId: folder.id,
      })
      .join(
        'collectibles',
        'foldersCollectibles.collectibleId',
        'collectibles.id'
      )
      .select('collectibles.id', 'collectibles.name', 'collectibles.imageUrl')
      .orderBy('collectibles.createdAt', 'desc');
    return {
      folderId: folder.id,
      folder: folder.name,
      collectibles: collectiblesInFolder,
    };
  });
  const results = await Promise.all(completeFolders);
  return {
    ...user,
    folders: results,
  };
};

const updateProfile = async (username, updated) => {
  await db('users')
    .update(updated)
    .where({ username });
  return getFullUserProfile(username);
};

module.exports = {
  getFullUserProfile,
  updateProfile,
};
