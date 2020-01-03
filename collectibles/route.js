const router = require('express').Router();

const Collectibles = require('./controller.js');

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

router.post('/', async (req, res) => {
  const collectible = req.body;
  console.log(collectible);

  Collectibles.addCollectible(collectible)
    .then(newCollectible => res.status(201).json(newCollectible))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Server error creating new collectible', error });
    });
});

module.exports = router;
