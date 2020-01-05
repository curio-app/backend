const router = require('express').Router();

const Tags = require('./controller.js');
const Collectibles = require('../collectibles/controller.js');

// middleware
const validateCollectibleId = async (req, res, next) => {
  const id = req.params.id || req.params.collectibleId;
  try {
    const collectible = await Collectibles.getCollectibleById(id);

    if (collectible) {
      req.collectible = collectible;
      next();
    } else {
      return res.status(400).json({ message: 'Invalid collectibleId' });
    }
    return null;
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Error validating collectible', error });
  }
};

// CRUD

router.get('/', async (req, res) => {
  try {
    const tags = await Tags.getTags();
    return res.status(200).json(tags);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get('/name/:tagName', async (req, res) => {
  const { tagName } = req.params;
  try {
    const tag = await Tags.getTagByName(tagName);
    return res.status(200).json(tag);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get('/:collectibleId', validateCollectibleId, async (req, res) => {
  const { collectibleId } = req.params;
  try {
    const tags = await Tags.getTagsByCollectibleId(collectibleId);
    return res.status(200).json(tags);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error getting tags by collectibleId',
      error,
    });
  }
});

router.delete('/:collectibleId', validateCollectibleId, async (req, res) => {
  const { collectibleId } = req.params;
  const { tagId } = req.body;
  try {
    const remaining = await Tags.removeTagFromCollectible(collectibleId, tagId);
    return res.status(200).json({
      message: `Successfully removed tag ${tagId} from collectible ${collectibleId}`,
      remaining,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error removing tag from collectible',
      error,
    });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: 'name is required to create a tag' });
  }

  try {
    const added = await Tags.addTag(req.body);
    return res.status(201).json(added);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error adding tag',
      error,
    });
  }
});

router.post('/:collectibleId', validateCollectibleId, async (req, res) => {
  const { collectibleId } = req.params;
  const tagName = req.body.name;
  let exists = false;

  try {
    const tags = await Tags.getTagsByCollectibleId(collectibleId);
    const findTag = await Tags.getTagByName(tagName);
    const newTag = await Tags.addTag({ name: tagName });

    tags.forEach(tag => {
      if (tag.id === findTag.id) {
        exists = true;
      }
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: 'That tag is already associated to the collectible' });
    }

    const added = Tags.addTagToCollectible(
      collectibleId,
      newTag.id || findTag.id
    );
    return res.status(201).json(added);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Sever error adding tag to collectible',
      error,
    });
  }
});

module.exports = router;
