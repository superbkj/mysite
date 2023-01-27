const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const asyncWrapper = require('../utils/asyncWrapper');
const UserModel = require('../models/userModel');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await UserModel.find({});
  res.status(200).json(users);
});

router.get('/:id', async (req, res) => {
  const details = await UserModel.findById(req.params.id);

  if (details) {
    res.status(200).json(details);
  } else {
    res.status(404).json({});
  }
});

router.post('/', asyncWrapper(async (req, res) => {
  const { username, email, password } = req.body;
  // the module will go through a series of rounds to give you a secure hash.
  // The value you submit is not just the number of
  // rounds the module will go through to hash your data.
  // The module will go through 2^rounds hashing iterations.
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = UserModel({ username, email, passwordHash });
  await user.save();

  res.status(201).json({ message: 'new user created' });
}));

module.exports = router;
