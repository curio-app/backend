const router = require('express').Router();

const Folders = require('./controller.js');

// middleware
const validateFolderId = (req, res, next) => {
  const id = req.params.id || req.params.folderId;

  Folders.getFolderById(id)
    .then(folder => {
      if (folder) {
        req.folder = folder;
        next();
      } else {
        res.status(400).json({ message: 'Invalid folderId' });
      }
    })
    .catch(err => res.status(500).json(err));
};

// CRUD

router.post('/', async (req, res) => {
  const { userId, name } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ message: 'userId is required to associate the folder' });
  }
  if (!name) {
    return res.status(400).json({ message: 'folderName is required' });
  }
  try {
    const folder = await Folders.addFolder(req.body);
    return res.status(201).json(folder);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Server error creating new folder', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const folders = await Folders.getAllFolders();
    return res.status(200).json(folders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get('/:id', validateFolderId, async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await Folders.getFolderById(id);
    return res.status(200).json(folder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const folder = await Folders.getFoldersByUserId(userId);
    return res.status(200).json(folder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.put('/:id', validateFolderId, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const folder = await Folders.updateFolder(id, changes);
    return res.status(200).json(folder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.delete('/:id', validateFolderId, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await Folders.deleteFolder(id);
    let status = 200;
    let message = 'Folder has been deleted';
    if (count < 1) {
      status = 404;
      message = 'Folder not found';
    }
    return status(status).json({ message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.post('/:folderId', validateFolderId, async (req, res) => {
  const { folderId } = req.params;
  const { collectibleId } = req.body;
  try {
    const added = await Folders.addCollectibleToFolder(collectibleId, folderId);
    return res.status(201).json(added);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error adding collectible to folder',
      error,
    });
  }
});

router.get('/collectibles/:folderId', validateFolderId, async (req, res) => {
  const { folderId } = req.params;
  try {
    const collectibles = await Folders.getCollectiblesInFolder(folderId);
    return res.status(200).json(collectibles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error getting collectibles from folder',
      error,
    });
  }
});

router.delete('/collectibles/:folderId', validateFolderId, async (req, res) => {
  const { folderId } = req.params;
  const { collectibleId } = req.body;
  try {
    const remaining = await Folders.removeCollectibleFromFolder(
      collectibleId,
      folderId
    );
    return res.status(200).json({
      message: `Successfully removed collectible ${collectibleId} from folder ${folderId}.`,
      remaining,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error removing collectible from folder',
      error,
    });
  }
});

module.exports = router;
