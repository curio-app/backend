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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password required' });
  }
  try {
    const user = await Users.getUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: 'User signed in', token });
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

module.exports = router;
