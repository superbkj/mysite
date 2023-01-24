// reads in .env file and makes those values available as environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const config = require('./utils/config');

const routes = require('./routes/main');

const { info, error } = require('./utils/logger');

mongoose.connect(config.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  error(err);
  process.exit(1);
});
mongoose.connection.on('connected', () => {
  info('Connected to mongo');
});

const app = express();

// To parse incoming requests with JSON payloads
app.use(express.json());

// In production, serve frontend from dist folder
app.use(express.static(`${path.resolve(__dirname, '..')}/frontend/dist`));

app.use('/', routes);

app.use((req, res) => {
  // 404: Not found
  res.status(404).send('<h1>Page not found</h1>');
});

app.use((err, req, res) => {
  // 500: Internal server error
  res.status(500).send('<h1>Something went wrong</h1>');
});

app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`);
});

module.exports = app;
