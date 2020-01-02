require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'curio-dev',
      host: '127.0.0.1',
      password: process.env.POSTGRES_PASSWORD,
      user: 'postgres',
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },
  testing: {
    client: 'pg',
    connection: {
      database: 'curio-test',
      host: '127.0.0.1',
      password: process.env.POSTGRES_PASSWORD,
      user: 'postgres',
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
    ssl: true,
  },
};
