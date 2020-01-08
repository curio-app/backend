const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { generateToken, authenticate } = require('./utils.js');
const Users = require('./controller.js');
const Folders = require('../folders/controller.js');

router.post('/register', async (req, res) => {
  const { email, password, imageUrl, username } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address required' });
  }
  if (!username) {
    return res.status(400).json({ message: 'Username required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password required' });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await Users.newUser({
      email,
      username,
      password: hashedPassword,
      imageUrl,
      role: 'user',
    });
    if (user.error !== undefined) {
      return res.status(400).json(user);
    }
    await Folders.addFolder({ userId: user.id, name: 'All' });
    const token = generateToken(user);
    return res.status(201).json({
      message: 'User successfully created!',
      token,
      ...user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Server error creating new user', error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password required' });
  }
  try {
    const user = await Users.getUserByUserName(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      delete user.password;
      res.status(200).json({ message: 'User signed in', token, ...user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
    return null;
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Server error while logging in', error });
  }
});

router.get('/get-user-info', authenticate, async (req, res) => {
  try {
    const user = await Users.getUserById(req.userId);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error fetching user data' });
  }
});

module.exports = router;
