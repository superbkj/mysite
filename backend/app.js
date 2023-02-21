// reads in .env file and makes those values available as environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
const connectMongo = require('./utils/connectMongo');

connectMongo();

const app = express();

// To parse incoming requests with JSON payloads
app.use(express.json());

// To parse incoming requests with some cookie
app.use(cookieParser());

// In production, serve frontend from dist folder
app.use(express.static(`${path.resolve(__dirname, '..')}/frontend/dist`));

app.get('/api/hello', (req, res) => {
  // 200: OK
  res.status(200).json({ message: 'Hello from backend' });
});

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);

app.use((req, res) => {
  // 404: Not found
  res.status(404).send('<h1>Page not found</h1>');
});

// your error handler middleware MUST have 4 parameters:
// error, req, res, next. Otherwise your handler won't fire

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log('error');
  if (err.name === 'CastError') {
    console.log('casterror');
    // 400: Bad Request
    res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    console.log('validation');
    res.status(400).send({ error: err });
  } else if (err.name === 'JsonWebTokenError') {
    console.log('jwt');
    res.status(401).send({ error: 'token missing or invalid' });
  } else if (err.name === 'TokenExpiredError') {
    console.log('expired');
    res.status(401).send({ error: 'token expired' });
  } else if (err.name === 'CredentialsError') {
    console.log('credentials');
    res.status(401).send({ error: 'invalid email or password' });
  } else {
    console.log('500');
    // 500: Internal server error
    res.status(err.status || 500).send(`<h1>Something went wrong</h1><p>${err}</p>`);
  }
});

module.exports = app;
