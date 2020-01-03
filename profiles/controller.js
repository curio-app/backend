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
      .orderBy('collectibles.createdAt', 'desc')
      .limit(5);
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

module.exports = {
  getFullUserProfile,
};
