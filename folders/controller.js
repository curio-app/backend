const db = require('../config/db.js');

const getAllFolders = () => {
  return db('folders');
};

const getFolderById = id => {
  return db('folders')
    .where({ id })
    .first();
};

const getFoldersByUserId = userId => {
  return db('folders').where({ userId });
};

const addFolder = async folder => {
  try {
    const [id] = await db('folders')
      .returning('id')
      .insert(folder);
    return getFolderById(id);
  } catch (error) {
    return { error };
  }
};

const updateFolder = (id, updated) => {
  return db('folders')
    .where({ id })
    .update(updated);
};

const deleteFolder = id => {
  return db('folders')
    .where({ id })
    .del();
};

const addCollectibleToFolder = async (collectibleId, folderId) => {
  const newCollectible = { collectibleId, folderId };
  await db('foldersCollectibles')
    .insert(newCollectible)
    .returning('id');
  return `Successfully added collectible ${collectibleId} to folder ${folderId}`;
};

const getCollectiblesInFolder = folderId => {
  return db('foldersCollectibles').where({ folderId });
};

const removeCollectibleFromFolder = async (collectibleId, folderId) => {
  await db('foldersCollectibles')
    .where({ collectibleId, folderId })
    .del();
  return getCollectiblesInFolder(folderId);
};

const getFolderByNameAndUserId = (name, userId) => {
  return db('folders')
    .where({ userId, name })
    .first();
};

module.exports = {
  getAllFolders,
  getFolderById,
  getFoldersByUserId,
  addFolder,
  updateFolder,
  deleteFolder,
  addCollectibleToFolder,
  getCollectiblesInFolder,
  removeCollectibleFromFolder,
  getFolderByNameAndUserId,
};
