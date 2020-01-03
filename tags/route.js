const router = require('express').Router();

const Tags = require('./controller.js');
const Collectibles = require('../collectibles/controller.js');

// middleware
const validateCollectibleId = (req, res, next) => {
  let id = req.params.id || req.params.collectibleId;

  console.log(id);

  Collectibles.getCollectibleById(id)
    .then(collectible => {
      console.log(collectible);
      if (collectible) {
        req.collectible = collectible;
        next();
      } else {
        res.status(400).json({ message: 'Invalid collectibleId' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error validating collectible', err });
    });
};

// CRUD

router.get('/', (req, res) => {
  Tags.getTags()
    .then(tags => res.status(200).json(tags))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get('/name/:tagName', (req, res) => {
  const { tagName } = req.params;
  Tags.getTagByName(tagName)
    .then(tag => res.status(200).json(tag))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get('/:collectibleId', validateCollectibleId, (req, res) => {
  const { collectibleId } = req.params;
  Tags.getTagsByCollectibleId(collectibleId)
    .then(tags => res.status(200).json(tags))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Server error getting tags by collectibleId',
        error: err,
      });
    });
});

router.delete('/:collectibleId', validateCollectibleId, (req, res) => {
  const { collectibleId } = req.params;
  const { tagId } = req.body;
  Tags.removeTagFromCollectible(collectibleId, tagId)
    .then(remaining => {
      res.status(200).json({
        message: `Successfully removed tag ${tagId} from collectible ${collectibleId}`,
        remaining,
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Server error removing tag from collectible',
        error,
      });
    });
});

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: 'name is required to create a tag' });
  }

  Tags.addTag(req.body)
    .then(added => {
      res.status(201).json(added);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Server error adding tag',
        error,
      });
    });
});

router.post('/:collectibleId', validateCollectibleId, async (req, res) => {
  try {
    const { collectibleId } = req.params;
    const tagName = req.body.name;
    let exists = false;

    const tags = await Tags.getTagsByCollectibleId(collectibleId);
    const findTag = await Tags.getTagByName(tagName);
    const newTag = await Tags.addTag({ name: tagName });

    console.log(tags);

    if (findTag) {
      tags.forEach(tag => {
        if (findTag.id) {
          if (tag.id === findTag.id) {
            exists = true;
          }
        }
      });
    }

    if (exists) {
      return res
        .status(400)
        .json({ message: 'That tag is already associated to the collectible' });
    }

    const added = await Tags.addTagToCollectible(
      collectibleId,
      newTag.id || findTag.id
    );

    console.log(tags);
    res.status(201).json(added);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error adding tag to collectible',
      error,
    });
  }
});

module.exports = router;
