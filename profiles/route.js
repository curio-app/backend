const router = require('express').Router();

const Profiles = require('./controller.js');

router.get('/:username', async (req, res) => {
  try {
    const user = await Profiles.getFullUserProfile(req.params.username);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error fetching user', error });
  }
});

router.put('/:username', (req, res) => {
  const { username } = req.params;
  const changes = req.body;

  Profiles.updateProfile(username, changes)
    .then(profile => res.status(200).json(profile))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
