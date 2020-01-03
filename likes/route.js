const router = require('express').Router();

const Likes = require('./controller.js');

// CRUD

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Likes.getLikesByCollectibleId(id)
    .then(likes => {
      res.status(200).json(likes);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/:collectibleId', async (req, res) => {
  const { collectibleId } = req.params;
  const userId = req.body.userId;
  let dupeUser = false;

  const likes = await Likes.getLikesByCollectibleId(collectibleId);

  likes.forEach(like => {
    if (like.id === userId) {
      dupeUser = true;
    }
  });

  if (dupeUser) {
    return res
      .status(400)
      .json({ message: 'User has already liked this collectible' });
  }

  Likes.addLike(collectibleId, userId)
    .then(likes => {
      res.status(201).json(likes);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:collectibleId', (req, res) => {
  const { collectibleId } = req.params;
  const userId = req.body.userId;
  Likes.removeLike(collectibleId, userId)
    .then(remaining => {
      res.status(200).json({ message: 'Unliked', remaining });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
