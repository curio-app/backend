const jwt = require('jsonwebtoken');

const generateToken = user => {
  const payload = {
    subject: user.id,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET || 'Secrets';

  const options = {
    expiresIn: '7d',
  };

  return jwt.sign(payload, secret, options);
};

module.exports = { generateToken };
