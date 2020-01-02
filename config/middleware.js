const cors = require('cors');
const { json } = require('express');
const helmet = require('helmet');

module.exports = server => {
  server.use(json());
  server.use(helmet());
  server.use(cors());
};
