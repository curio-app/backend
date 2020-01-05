const router = require('express').Router();

const Likes = require('./controller.js');

// CRUD

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const likes = await Likes.getLikesByCollectibleId(id);
    return res.status(200).json(likes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/:collectibleId', async (req, res) => {
  const { collectibleId } = req.params;
  const { userId } = req.body;
  try {
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
    const newLikes = await Likes.addLike(collectibleId, userId);
    return res.status(201).json(newLikes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.delete('/:collectibleId/:userId', async (req, res) => {
  const { collectibleId, userId } = req.params;
  try {
    const remaining = await Likes.removeLike(collectibleId, userId);
    return res.status(200).json({ message: 'Unliked', remaining });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
