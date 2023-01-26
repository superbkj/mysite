// reads in .env file and makes those values available as environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const connectMongo = require('./utils/connectMongo');

connectMongo();

const app = express();

// To parse incoming requests with JSON payloads
app.use(express.json());

// In production, serve frontend from dist folder
app.use(express.static(`${path.resolve(__dirname, '..')}/frontend/dist`));

app.get('/api/hello', (req, res) => {
  // 200: OK
  res.status(200).json({ message: 'Hello from backend' });
});

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  // 404: Not found
  res.status(404).send('<h1>Page not found</h1>');
});

// your error handler middleware MUST have 4 parameters:
// error, req, res, next. Otherwise your handler won't fire

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    // 400: Bad Request
    res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ error: err });
  } else {
  // 500: Internal server error
    res.status(err.status || 500).send('<h1>Something went wrong</h1>');
  }
});

module.exports = app;
