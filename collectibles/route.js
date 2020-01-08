const router = require('express').Router();

const { authenticate } = require('../auth/utils.js');
const Collectibles = require('./controller.js');
const Tags = require('../tags/controller.js');
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
      if (req.body.tags.length > 0) {
        await req.body.tags.reduce(async (acc, curTag) => {
          await acc;
          const tagExists = await Tags.getTagByName(curTag);
          let tagId;
          if (tagExists) {
            tagId = tagExists.id;
          } else {
            const newTag = await Tags.addTag(curTag);
            tagId = newTag.id;
          }
          return Tags.addTagToCollectible(collectible.id, tagId);
        }, Promise.resolve);
      }
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

router.get('/latest', async (req, res) => {
  try {
    const collectibles = await Collectibles.getLatest();
    res.status(200).json(collectibles);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Server error fetching collectibles', error });
  }
});

router.get('/:collectibleId', async (req, res) => {
  try {
    const collectible = await Collectibles.getCollectibleById(
      req.params.collectibleId
    );
    res.status(200).json(collectible);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Server error fetching collectible data', error });
  }
});

router.delete('/:collectibleId', authenticate, async (req, res) => {
  if (!req.admin) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const count = await Collectibles.deleteCollectible(
      req.params.collectibleId
    );
    let status = 200;
    let message = 'Collectible has been deleted';
    if (count < 1) {
      status = 404;
      message = 'Collectible not found';
    }
    return res.status(status).json({ message });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Server error while removing collectible' });
  }
});

module.exports = router;
