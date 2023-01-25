const express = require('express');

const PostModel = require('../models/postModel');

const { info, obj } = require('../utils/logger');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();

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
  /*
  if (keywords) {
    let titleRegex = '(';
    let leadRegex = '(';
    let textRegex = '(';

    keywordsArr.forEach((keyword, index) => {
      if (index > 0) {
        titleRegex += '|';
        leadRegex += '|';
        textRegex += '|';
      }
      titleRegex += keyword;
      leadRegex += keyword;
      textRegex += keyword;
    });

    titleRegex += ')';
    leadRegex += ')';
    textRegex += ')';

    query = {
      $or: [
        // i for ignoreCase
        { title: new RegExp(titleRegex, 'i') },
        { lead: new RegExp(leadRegex, 'i') },
        { text: new RegExp(textRegex, 'i') },
      ],
    };
  }
  */

  obj(query);

  const results = await PostModel.find(query);
  res.status(200).json(results);
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
