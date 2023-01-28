// const mongoose = require('mongoose');
const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

// const testdataLoaderId = mongoose.Types.ObjectId('63d347cb0fabaa39487bc0bf');

const initialPosts = [
  {
    title: 'My Site',
    lead: 'Welcome to my site',
    text: 'This is initial post 1. Welcome to my site. Nice to see you.',
    createdDate: new Date(),
    // user: testdataLoaderId,
  },
  {
    title: 'Test Environment',
    lead: 'Welcome to the test env',
    text: 'This is initial post 2. This is the test environment of my site.',
    createdDate: new Date(),
    // user: testdataLoaderId,
  },
  {
    title: 'Apple',
    lead: 'Grape',
    text: 'Orange',
    createdDate: new Date(),
    // user: testdataLoaderId,
  },
];

const initialUsers = [
  {
    username: 'testuser',
    email: 't@t.com',
    password: 'asd',
  },
];

const postsInDb = async () => {
  const posts = await PostModel.find({});
  return posts;
};

const usersInDb = async () => {
  const users = await UserModel.find({});
  return users;
};

const nonExistingId = async () => {
  const user = await UserModel.findOne({});

  const post = new PostModel({
    title: 'Will remove',
    lead: 'Will remove',
    text: 'Will remove',
    createdDate: new Date(),
    // eslint-disable-next-line no-underscore-dangle
    user: user._id,
  });
  await post.save();
  await post.remove();

  // eslint-disable-next-line no-underscore-dangle
  return post._id.toString();
};

module.exports = {
  initialPosts, initialUsers, nonExistingId, postsInDb, usersInDb,
};
