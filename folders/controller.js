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
  } catch (err) {
    return { error: err };
  }
};

const updateFolder = (id, updated) => {
  return db('folders')
    .update(updated)
    .where({ id })
    .then(updatedFolder => {
      return getFolderById(id);
    });
};

const deleteFolder = id => {
  return db('folders')
    .where({ id })
    .del()
    .then(result => result);
};

const addCollectibleToFolder = (collectible_Id, folder_Id) => {
  const newCollectible = { collectibleId: collectible_Id, folderId: folder_Id };

  return db('foldersCollectibles')
    .insert(newCollectible)
    .returning('id')
    .then(
      result =>
        `Successfully added collectible ${collectible_Id} to folder ${folder_Id}`
    );
};

const getCollectiblesInFolder = folder_Id => {
  return db('foldersCollectibles')
    .where({ folderId: folder_Id })
    .then(result => result);
};

const removeCollectibleFromFolder = (collectible_Id, folder_Id) => {
  return db('foldersCollectibles')
    .where({ collectibleId: collectible_Id }, { folderId: folder_Id })
    .del()
    .then(result => getCollectiblesInFolder(folder_Id));
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
};
