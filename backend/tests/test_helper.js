const PostModel = require('../models/postModel');

const initialPosts = [
  {
    title: 'My Site',
    lead: 'Welcome to my site',
    text: 'This is initial post 1. Welcome to my site. Nice to see you.',
    createdDate: new Date(),
  },
  {
    title: 'Test Environment',
    lead: 'Welcome to the test env',
    text: 'This is initial post 2. This is the test environment of my site.',
    createdDate: new Date(),
  },
];

const nonExistingId = async () => {
  const post = new PostModel({
    title: 'Will remove',
    lead: 'Will remove',
    text: 'Will remove',
    createdDate: new Date(),
  });
  await post.save();
  await post.remove();

  // eslint-disable-next-line no-underscore-dangle
  return post._id.toString();
};

const postsInDb = async () => {
  const posts = await PostModel.find({});
  return posts;
};

module.exports = {
  initialPosts, nonExistingId, postsInDb,
};
