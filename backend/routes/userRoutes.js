const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const asyncWrapper = require('../utils/asyncWrapper');
const UserModel = require('../models/userModel');

const router = express.Router();

router.post('/api/user-registration', asyncWrapper(async (req, res) => {
  const { username, email, password } = req.body;

  // the module will go through a series of rounds to give you a secure hash.
  // The value you submit is not just the number of
  // rounds the module will go through to hash your data.
  // The module will go through 2^rounds hashing iterations.
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  await UserModel.create({ username, email, passwordHash });

  res.status(201).json({ message: 'new user created' });
}));

module.exports = router;
