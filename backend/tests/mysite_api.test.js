const mongoose = require('mongoose');

// The test imports the Express application from the app.js module
// and wraps it with the supertest function
// into a so-called superagent object.
// This object is assigned to the api variable
// and tests can use it for making HTTP requests to the backend

// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

beforeEach(async () => {
  await UserModel.deleteMany({});

  const passwordHash = await bcrypt.hash(helper.initialUsers[0].password, 10);
  const testuserObj = new UserModel({ ...helper.initialUsers[0], passwordHash });
  await testuserObj.save();

  await PostModel.deleteMany({});

  const promiseArray = helper.initialPosts.map((post) => {
    // eslint-disable-next-line no-underscore-dangle
    const postObj = new PostModel({ ...post, userId: testuserObj._id });
    return postObj.save();
  });

  // The Promise.all method can be used
  // for transforming an array of promises
  // into a single promise, that will be fulfilled
  // once every promise in the array passed to it as a parameter is resolved
  await Promise.all(promiseArray);
});

describe('User logging in', () => {
  const user = helper.initialUsers[0];
  test('succeeds with valid email and password', async () => {
    const response = await api
      .post('/api/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    expect(response.body.username).toEqual(user.username);
  });

  test('fails with invalid email', async () => {
    await api
      .post('/api/login')
      .send({ email: 'invalid@invalid.com', password: user.password })
      .expect(401);
  });

  test('fails with invalid password', async () => {
    await api
      .post('/api/login')
      .send({ email: user.username, password: 'invalid' })
      .expect(401);
  });
});

// There are two types of expect() ?
// One is the method provided by supertest ?
// Another is the method provided by Jest ?

describe('When getting initial posts', () => {
  test('posts are returned as json', async () => {
    await api
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all posts are returned', async () => {
    const response = await api.get('/api/posts');

    expect(response.body).toHaveLength(helper.initialPosts.length);
  });

  test('a specific post is within the returned notes', async () => {
    const response = await api.get('/api/posts');

    const texts = response.body.map((r) => r.text);
    expect(texts).toContain('This is initial post 2. This is the test environment of my site.');
  });
});

describe('Adding a post', () => {
  const user = helper.initialUsers[0];

  test('fails without login', async () => {
    const newPost = {
      title: 'I have only title',
    };

    await api
      .post('/api/posts')
      .send(newPost)
      .expect(401); // 401: Unauthorized

    const postsAtEnd = await helper.postsInDb();

    expect(postsAtEnd).toHaveLength(helper.initialPosts.length);
  });

  test('fails with an invalid input', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ email: user.email, password: user.password });

    const data = loginResponse.body;

    const newPost = {
      title: 'I have only title',
    };

    await api
      .post('/api/posts')
      .set('Cookie', [`loggedInUser=${JSON.stringify(data)}`])
      .send(newPost)
      .expect(400); // 400: Bad Request

    const postsAtEnd = await helper.postsInDb();

    expect(postsAtEnd).toHaveLength(helper.initialPosts.length);
  });

  test('succeeds with valid input', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ email: user.email, password: user.password });

    const data = loginResponse.body;
    const userFoundInDB = await UserModel.findOne({ email: user.email });

    const newPost = {
      title: 'NEW POST',
      // lead: 'This is a new post',
      text: 'This is a new post created for testing purpose',
      createdDate: new Date(),
      // eslint-disable-next-line no-underscore-dangle
      userId: userFoundInDB._id,
    };

    await api
      .post('/api/posts')
      .set('Cookie', [`loggedInUser=${JSON.stringify(data)}`])
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const postsAtEnd = await helper.postsInDb();
    const texts = postsAtEnd.map((r) => r.text);

    expect(postsAtEnd).toHaveLength(helper.initialPosts.length + 1);
    expect(texts).toContain('This is a new post created for testing purpose');
  });
});

describe('When searching posts', () => {
  test('a specific post can be searched and found', async () => {
    const params = {};
    params.keywords = 'Apple Grape Orange';
    const paramsURLStr = new URLSearchParams(params).toString();

    const response = await api
      .get(`/api/posts?${paramsURLStr}`)
      .send(params)
      .expect(200);

    expect(response.body).toHaveLength(1);
  });

  test('No post is found if the query is not matching anything', async () => {
    const params = {};
    params.keywords = 'Apple Grape Lemon';
    const paramsURLStr = new URLSearchParams(params).toString();

    const response = await api
      .get(`/api/posts?${paramsURLStr}`)
      .send(params)
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
    const validButNonExistingId = await helper.nonExistingId();

    await api
      // eslint-disable-next-line no-underscore-dangle
      .get(`/api/posts/${validButNonExistingId}`)
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

// describe('Deleting a specific user', () => {});

describe('Creation of users', () => {
  test('succeeds with valid input', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'testuser2',
      email: 'test2@test.com',
      password: 'test2pass',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const emails = usersAtEnd.map((u) => u.email);
    expect(emails).toContain(newUser.email);
  });

  test('fails with duplicate email', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'abc',
      email: helper.initialUsers[0].email,
      password: 'abc',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

// describe('When searching users,' () => {});
// describe('Viewing a specific user' () => {});

afterAll(async () => {
  await mongoose.connection.close();
});
