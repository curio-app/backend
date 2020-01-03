const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'Secrets';

const generateToken = user => {
  const payload = {
    subject: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const options = {
    expiresIn: '7d',
  };

  return jwt.sign(payload, secret, options);
};

const authenticate = (req, res, next) => {
  const token = req.get('Authorization');
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).json(err);
      req.decoded = decoded;
      if (decoded.role === 'admin') req.admin = true;
      else req.admin = false;
      req.userId = decoded.subject;
      return next();
    });
  } else {
    return res.status(401).json({ message: 'Please log in' });
  }
  return null;
};

module.exports = { generateToken, authenticate };
