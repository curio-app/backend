const router = require('express').Router();

const Collectibles = require('./controller.js');

router.post('/', async (req, res) => {
  const collectible = req.body;
  console.log(collectible);

  Collectibles.addCollectible(collectible)
    .then(collectible => res.status(201).json(collectible))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Server error creating new collectible', error });
    });
});

module.exports = router;
