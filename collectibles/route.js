const router = require('express').Router();

const { authenticate } = require('../auth/utils.js');
const Collectibles = require('./controller.js');
const Folders = require('../folders/controller.js');

router.get('/', async (req, res) => {
  try {
    const collectibles = await Collectibles.getAllCollectibles();
    res.status(200).json(collectibles);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Server error fetching collectibles', error });
  }
});

router.post('/:userId', authenticate, async (req, res) => {
  if (req.userId.toString() === req.params.userId) {
    const { name, description, story, imageUrl, sellable } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: 'Please include a name for the collectible' });
    }
    if (!description) {
      return res
        .status(400)
        .json({ message: 'Please include a description for the collectible' });
    }

    try {
      const allFolder = await Folders.getFolderByNameAndUserId(
        'All',
        req.userId
      );
      const collectible = await Collectibles.addCollectible(
        {
          name,
          description,
          story,
          imageUrl,
          sellable,
        },
        allFolder.id
      );
      return res.status(201).json(collectible);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'Server error creating new collectible', error });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized, yo.' });
  }
});

module.exports = router;
