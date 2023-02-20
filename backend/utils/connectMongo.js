const mongoose = require('mongoose');
const { info, error } = require('./logger');
const config = require('./config');

mongoose.set('strictQuery', false);

const connectMongo = () => {
  mongoose.connect(config.MONGODB_URI);
  mongoose.connection.on('error', (err) => {
    error(err);
    process.exit(1);
  });
  mongoose.connection.on('connected', () => {
    info('Connected to mongo');
  });
};

module.exports = connectMongo;
