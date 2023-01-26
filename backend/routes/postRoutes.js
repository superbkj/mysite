const express = require('express');

const PostModel = require('../models/postModel');

const { info, obj } = require('../utils/logger');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();

router.get('/', asyncWrapper(async (req, res) => {
  let mongoQuery = {};
  const { keywords } = req.query;

  if (keywords) {
    const keywordsArr = keywords.trim().replaceAll('　', ' ').replace(/  +/g, ' ').split(' ');
    let regexStr = '^';

    keywordsArr.forEach((keyword) => {
      regexStr += `(?=.*${keyword})`;
    });

    mongoQuery = {
      $or: [
        // i for ignoreCase
        { title: new RegExp(regexStr, 'i') },
        { lead: new RegExp(regexStr, 'i') },
        { text: new RegExp(regexStr, 'i') },
      ],
    };
  }

  obj(mongoQuery);

  const results = await PostModel.find(mongoQuery).sort({ createdDate: -1 });

  // json():
  // Sets the correct content-type (application/json ?)
  // Sends JSON string converted from object using JSON.stringify().
  res.status(200).json(results);
}));

router.get('/:id', asyncWrapper(async (req, res) => {
  const details = await PostModel.findById(req.params.id);
  if (details) res.status(200).json(details);
  else res.status(404).json({});
}));

router.post('/', asyncWrapper(async (req, res) => {
  const { title, lead, text } = req.body;
  await PostModel.create({
    title, lead, text, createdDate: new Date(),
  });
  // 201: Created
  res.status(201).json({ message: 'new post created' });
}));

const sleep = (ms) => new Promise(
  (resolve) => {
    setTimeout(resolve, ms);
  },
);

// Only for testing
router.get('/test/load-testdata', asyncWrapper(async (req, res) => {
  info('yes');
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
