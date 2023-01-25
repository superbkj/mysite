const mongoose = require('mongoose');

// The test imports the Express application from the app.js module
// and wraps it with the supertest function
// into a so-called superagent object.
// This object is assigned to the api variable
// and tests can use it for making HTTP requests to the backend

// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../index');

const api = supertest(app);

const PostModel = require('../models/postModel');

beforeEach(async () => {
  await PostModel.deleteMany({});

  const promiseArray = helper.initialPosts.map((post) => {
    const postObj = new PostModel(post);
    return postObj.save();
  });

  // The Promise.all method can be used
  // for transforming an array of promises
  // into a single promise, that will be fulfilled
  // once every promise in the array passed to it as a parameter is resolved
  await Promise.all(promiseArray);
});

// There are two types of expect() ?
// One is the method provided by supertest ?
// Another is the method provided by Jest ?

describe('Check for initial posts', () => {
  test('posts are returned as json', async () => {
    await api
      .get('/api/hello')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all posts are returned', async () => {
    const response = await api.get('/api/latest');

    expect(response.body).toHaveLength(helper.initialPosts.length);
  });

  test('a specific post is within the returned notes', async () => {
    const response = await api.get('/api/latest');

    const texts = response.body.map((r) => r.text);
    expect(texts).toContain('This is initial post 2. This is the test environment of my site.');
  });
});

describe('Check for post addition', () => {
  test('an invalid post cannot be added', async () => {
    const newPost = {
      title: 'I have only title',
    };

    await api
      .post('/api/make-a-post')
      .send(newPost)
      .expect(400); // 400: Bad Request

    const postsAtEnd = await helper.postsInDb();

    expect(postsAtEnd).toHaveLength(helper.initialPosts.length);
  });

  test('a valid post can be added', async () => {
    const newPost = {
      title: 'NEW POST',
      lead: 'This is a new post',
      text: 'This is a new post created for testing purpose',
      createdDate: new Date(),
    };

    await api
      .post('/api/make-a-post')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const postsAtEnd = await helper.postsInDb();
    const texts = postsAtEnd.map((r) => r.text);

    expect(postsAtEnd).toHaveLength(helper.initialPosts.length + 1);
    expect(texts).toContain('This is a new post created for testing purpose');
  });
});

describe('Check for post search', () => {
  test('a specific post can be searched and found', async () => {
    const userQuery = { keywords: 'initial post' };
    const response = await api.post('/api/search')
      .send(userQuery)
      .expect(200);

    expect(response.body).toHaveLength(helper.initialPosts.length);
  });

  test('No post is found if the query is not matching anything', async () => {
    const userQuery = { keywords: 'no-match-query' };
    const response = await api.post('/api/search')
      .send(userQuery)
      .expect(200);

    expect(response.body).toHaveLength(0);
  });
});

describe('Viewing a specific post', () => {
  test('succeeds with valid id', async () => {
    const posts = await helper.postsInDb();
    const postToView = posts[0];

    const response = await api
      // eslint-disable-next-line no-underscore-dangle
      .get(`/api/posts/${postToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.text).toEqual(postToView.text);
  });

  test('fails with 404 if post does not exist', async () => {
    const validButnonExistingId = await helper.nonExistingId();

    await api
      // eslint-disable-next-line no-underscore-dangle
      .get(`/api/posts/${validButnonExistingId}`)
      .expect(404);
  });

  test('fails with 400 if id is invalid', async () => {
    const invalidId = 'invalid1234';

    await api
      // eslint-disable-next-line no-underscore-dangle
      .get(`/api/posts/${invalidId}`)
      .expect(400);
  });
});

/* Test for removing
test();
*/

afterAll(async () => {
  await mongoose.connection.close();
});
