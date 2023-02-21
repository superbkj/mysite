// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();

const UserModel = require('../models/userModel');
const asyncWrapper = require('../utils/asyncWrapper');

router.post('/', asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    // 401: Unauthorized ログインに失敗したり、権限がないときに出す
    /*
    return res.status(401).json({
      error: 'invalid email or password',
    });
    */
    const err = new Error('invalid email or password');
    err.name = 'CredentialsError';
    throw err;
  }

  const userForToken = {
    username: user.username,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };

  // a token is created with the method jwt.sign
  // The token contains the email and the user id in a digitally signed form.

  // The token has been digitally signed
  // using a string from the environment variable SECRET as the secret.

  // A digital signature is a mathematical technique
  // used to validate the authenticity and integrity of a message, software or digital document.

  // authenticity: the message was created by a known sender
  // integrity: the message was not altered in transit
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 5 * 60 }, // 5 mins
  );

  return res.status(200).send({ token, username: user.username });
}));

module.exports = router;
