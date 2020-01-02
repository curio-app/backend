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
  return db('folders')
    .where({ userId })
    .first();
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
module.exports = {
  getAllFolders,
  getFolderById,
  getFoldersByUserId,
  addFolder,
  updateFolder,
  deleteFolder,
};
