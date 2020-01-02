const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { generateToken } = require('./utils.js');
const Users = require('./controller.js');

router.post('/register', async (req, res) => {
  const { email, password, imageUrl } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password required' });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await Users.newUser({
      email,
      password: hashedPassword,
      imageUrl,
      role: 'user',
    });
    if (user.error !== undefined) {
      return res.status(400).json(user);
    }
    const token = generateToken(user);
    return res.status(201).json({
      message: 'User successfully created!',
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Server error creating new user', error });
  }
});

module.exports = router;
