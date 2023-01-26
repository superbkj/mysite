const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

const { info, obj } = require('../utils/logger');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();

// json():
// Sets the correct content-type (application/json ?)
// Sends JSON string converted from object using JSON.stringify().
router.get('/api/hello', (req, res) => {
  // 200: OK
  res.status(200).json({ message: 'Hello from backend' });
});

router.get('/api/latest', asyncWrapper(async (req, res) => {
  const results = await PostModel.find().sort({ createdDate: -1 });
  res.status(200).json(results);
}));

router.get('/api/posts/:id', asyncWrapper(async (req, res) => {
  const details = await PostModel.findById(req.params.id);
  if (details) res.status(200).json(details);
  else res.status(404).json({});
}));

router.post('/api/make-a-post', asyncWrapper(async (req, res) => {
  const { title, lead, text } = req.body;
  await PostModel.create({
    title, lead, text, createdDate: new Date(),
  });
  // 201: Created
  res.status(201).json({ message: 'new post created' });
}));

router.post('/api/search', asyncWrapper(async (req, res) => {
  let query = {};
  const { keywords } = req.body;
  const keywordsArr = keywords.trim().replaceAll('　', ' ').replace(/  +/g, ' ').split(' ');

  if (keywords) {
    let regexStr = '^';

    keywordsArr.forEach((keyword) => {
      regexStr += `(?=.*${keyword})`;
    });

    query = {
      $or: [
        // i for ignoreCase
        { title: new RegExp(regexStr, 'i') },
        { lead: new RegExp(regexStr, 'i') },
        { text: new RegExp(regexStr, 'i') },
      ],
    };
  }

  obj(query);

  const results = await PostModel.find(query);
  res.status(200).json(results);
}));

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

const sleep = (ms) => new Promise(
  (resolve) => {
    setTimeout(resolve, ms);
  },
);

router.get('/api/load-testdata', asyncWrapper(async (req, res) => {
  for (let i = 0; i < 3; i += 1) {
    for (let j = 1; j <= 10; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(process.env.LOREM_JPSUM_CONNECTION_URL);
      // eslint-disable-next-line no-await-in-loop
      const data = await response.json();
      // eslint-disable-next-line no-await-in-loop
      await PostModel.create({
        title: `Test Title ${Math.floor(Math.random() * 300)}`,
        lead: data.content.substring(0, 50),
        text: data.content,
        createdDate: new Date(),
      });
    }
    info('waiting 1 sec...');
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000);
  }
  info('completed');
  res.status(200).json({ message: 'test data loaded' });
}));

module.exports = router;
