const mongoose = require('mongoose');

// The test imports the Express application from the app.js module
// and wraps it with the supertest function
// into a so-called superagent object.
// This object is assigned to the api variable
// and tests can use it for making HTTP requests to the backend

// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const app = require('../index');

const api = supertest(app);

// There are two types of expect() ?
// One is the method provided by supertest ?
// Another is the method provided by Jest ?

test('posts are returned as json', async () => {
  await api
    .get('/api/hello')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are 2 posts', async () => {
  const response = await api.get('/api/latest');

  expect(response.body).toHaveLength(2);
});

test('The test of the first post is "test environment"', async () => {
  const response = await api.get('/api/latest');

  expect(response.body[0].text).toBe('test environment');
});

afterAll(async () => {
  await mongoose.connection.close();
});
