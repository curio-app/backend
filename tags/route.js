const router = require('express').Router();

const Tags = require('./controller.js');

// CRUD

router.get('/', (req, res) => {
  Tags.getTags()
    .then(tags => res.status(200).json(tags))
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
