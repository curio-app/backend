const router = require('express').Router();

const Tags = require('./controller.js');

// middleware

// CRUD

router.get('/', (req, res) => {
  Tags.getTags()
    .then(tags => res.status(200).json(tags))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get('/:collectibleId', (req, res) => {
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

router.delete('/:collectibleId', (req, res) => {
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

router.post('/:collectibleId', async (req, res) => {
  const { collectibleId } = req.params;
  const { tagId } = req.body;
  let exists = false;

  const tags = await Tags.getTagsByCollectibleId(collectibleId);

  tags.forEach(tag => {
    if (tag.id === tagId) {
      exists = true;
    }
  });

  if (exists) {
    return res
      .status(400)
      .json({ message: 'That tag is already associated to the collectible' });
  }

  Tags.addTagToCollectible(collectibleId, tagId)
    .then(added => {
      res.status(201).json(added);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Sever error adding tag to collectible',
        error,
      });
    });
});

module.exports = router;
