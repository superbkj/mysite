const express = require('express');
const mongoose = require('mongoose');

const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

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

    // すべてのkeywordsが(title + lead + text)に含まれるように修正
    // user名もキーワード検索に含まれるよう修正
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

  const results = await PostModel
    .find(mongoQuery)
    .populate('user', { username: 1 })
    .sort({ createdDate: -1 });

  // json():
  // Sets the correct content-type (application/json ?)
  // Sends JSON string converted from object using JSON.stringify().
  res.status(200).json(results);
}));

router.get('/:id', asyncWrapper(async (req, res) => {
  // console.log('yes');
  // const details = await PostModel.findById(req.params.id);
  const details = await PostModel.findById(req.params.id).populate('user', { username: 1 });

  if (details) {
    res.status(200).json(details);
  } else {
    res.status(404).json({});
  }
}));

router.post('/', asyncWrapper(async (req, res) => {
  const {
    title, lead, text, userId,
  } = req.body;

  // console.log('userid', userId);

  const user = await UserModel.findById(userId);

  const post = PostModel({
    title,
    lead,
    text,
    createdDate: new Date(),
    // eslint-disable-next-line no-underscore-dangle
    user: user ? user._id : null,
  });

  const savedPost = await post.save();
  // eslint-disable-next-line no-underscore-dangle
  user.posts = user.posts.concat(savedPost._id);
  await user.save();

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
  for (let i = 0; i < 3; i += 1) {
    for (let j = 1; j <= 10; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(process.env.LOREM_JPSUM_CONNECTION_URL);
      // eslint-disable-next-line no-await-in-loop
      const data = await response.json();
      const testdataLoaderId = mongoose.Types.ObjectId('63d347cb0fabaa39487bc0bf');

      const post = PostModel({
        title: `Test Title ${Math.floor(Math.random() * 300)}`,
        lead: data.content.substring(0, 50),
        text: data.content,
        createdDate: new Date(),
        user: testdataLoaderId,
      });
      // eslint-disable-next-line no-await-in-loop
      const savedPost = await post.save();

      // eslint-disable-next-line no-await-in-loop
      const testdataLoader = await UserModel.findById(testdataLoaderId);

      // eslint-disable-next-line no-underscore-dangle
      testdataLoader.posts = testdataLoader.posts.concat(savedPost._id);
      testdataLoader.save();
    }
    info('waiting 1 sec...');
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000);
  }
  info('completed');
  res.status(200).json({ message: 'test data loaded' });
}));

module.exports = router;
