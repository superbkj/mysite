const mongoose = require('mongoose');

// Mongoose does not have a built-in validator
// for checking the uniqueness of a field
// eslint-disable-next-line import/no-extraneous-dependencies
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
});

UserSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
