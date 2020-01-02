const { hashSync } = require('bcryptjs');

exports.seed = knex => {
  return knex('users').insert([
    {
      email: 'keveightysev@gmail.com',
      password: hashSync('password', 8),
      role: 'admin',
      imageUrl:
        'https://image.businessinsider.com/5db7100cdee01970e3603c43?width=1300&format=jpeg&auto=webp',
    },
    {
      email: 'mngmay@gmail.com',
      password: hashSync('password', 8),
      role: 'admin',
      imageUrl:
        'https://img.huffingtonpost.com/asset/57fbddf6170000bc16acad94.jpeg?cache=k71yznkim0&ops=crop_0_211_500_410,scalefit_630_noupscale',
    },
  ]);
};
