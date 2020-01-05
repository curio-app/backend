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

router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const changes = req.body;
  try {
    const profile = await Profiles.updateProfile(username, changes);
    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
