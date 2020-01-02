const express = require('express');
const configureMiddleware = require('./config/middleware.js');

const server = express();

configureMiddleware(server);

server.get('/', (req, res) => {
  return res.send(
    '<h1>This is my server</h1><h2>There are others like it but this one is mine</h2>'
  );
});

module.exports = server;
