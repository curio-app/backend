const db = require('../config/db.js');

const getUserByEmail = email => {
  return db('users')
    .where({ email })
    .first();
};

const getUserById = id => {
  return db('users')
    .where({ id })
    .first();
};

const newUser = async user => {
  try {
    const [id] = await db('users')
      .returning('id')
      .insert(user);
    return getUserById(id);
  } catch (err) {
    const { constraint } = err;
    switch (constraint) {
      case 'users_email_unique':
        return { error: 'Email address already exists' };
      default:
        return { error: err.detail };
    }
  }
};

module.exports = { getUserByEmail, getUserById, newUser };
