const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

const { info, obj } = require('../utils/logger');
const asyncWrapper = require('../utils/asyncWrapper');
const { response } = require('../app');

const router = express.Router();

router.get('/', asyncWrapper(async (req, res) => {
  let mongoQuery = {};
  const { keywords } = req.query;

  if (keywords) {
    const keywordsArr = keywords.trim().replaceAll('　', ' ').replace(/  +/g, ' ').split(' ');
    let regexStr = '^';

    // Positive lookahead
    keywordsArr.forEach((keyword) => {
      regexStr += `(?=.*${keyword})`;
    });

    // user名もキーワード検索に含まれるよう修正
    mongoQuery = {
      merged: new RegExp(regexStr, 'i'),
      /*
      $or: [
        // i for ignoreCase
        { title: new RegExp(regexStr, 'i') },
        { lead: new RegExp(regexStr, 'i') },
        { text: new RegExp(regexStr, 'i') },
      ],
      */
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

// isolates the token from the authorization header.
const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  // Bearer: One of the authentication schemes
  // Authorization header also tells which authentication scheme is used.
  // Authorization (認証): Determines whether users are who they claim to be
  // Authentication (認可・承認): Determines what users can and cannot access
  if (authorization && authorization.startsWith('Bearer ')) {
    // Authorization header will have the value like "Bearer [token]".
    // For example:
    // Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
    return authorization.replace('Bearer ', '');
  }
  return null;
};

router.post('/', asyncWrapper(async (req, res) => {
  const {
    title,
    lead,
    text,
  } = req.body;

  // The validity of the token is checked with jwt.verify.
  // The method also decodes the token,
  // in other words, returns the Object which the token was based on.
  // (Object used when jwt.sign ?)
  // If the token is missing or is it invalid,
  // the exception JsonWebTokenError is raised
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await UserModel.findById(decodedToken.id);

  // const user = await UserModel.findOne({});

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
  return res.status(201).json({ message: 'new post created' });
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
      const jpsumResponse = await fetch(process.env.LOREM_JPSUM_CONNECTION_URL);
      // eslint-disable-next-line no-await-in-loop
      const data = await jpsumResponse.json();
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
