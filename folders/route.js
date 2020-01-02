const router = require('express').Router();

const Folders = require('./controller.js');

router.post('/', (req, res) => {
  const { userId, name } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ message: 'userId is required to associate the folder' });
  }
  if (!name) {
    return res.status(400).json({ message: 'folderName is required' });
  }

  Folders.addFolder(req.body)
    .then(folder => {
      res.status(201).json(folder);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Server error creating new folder', error });
    });
});

router.get('/', (req, res) => {
  Folders.getAllFolders()
    .then(folders => res.status(200).json(folders))
    .catch(err => res.status(500).json({ error: err }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Folders.getFolderById(id)
    .then(folder => res.status(200).json(folder))
    .catch(err => res.status(500).json({ error: err }));
});

router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  Folders.getFoldersByUserId(userId)
    .then(folder => res.status(200).json(folder))
    .catch(err => res.status(500).json({ error: err }));
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Folders.updateFolder(id, changes)
    .then(folder => res.status(200).json(folder))
    .catch(err => res.status(500).json({ error: err }));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Folders.deleteFolder(id)
    .then(deleted =>
      res.status(200).json({ message: `Successfully deleted folder ${id}` })
    )
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
