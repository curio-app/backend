const express = require('express');
const configureMiddleware = require('./config/middleware.js');

const auth = require('./auth/route.js');
const collectibles = require('./collectibles/route.js');
const folders = require('./folders/route.js');
const tags = require('./tags/route.js');
const profiles = require('./profiles/route.js');

const server = express();

configureMiddleware(server);

server.get('/', (req, res) => {
  return res.send(
    '<h1>This is my server</h1><h2>There are others like it but this one is mine</h2>'
  );
});

server.use('/auth', auth);
server.use('/collectibles', collectibles);
server.use('/folders', folders);
server.use('/tags', tags);
server.use('/profiles', profiles);

module.exports = server;
