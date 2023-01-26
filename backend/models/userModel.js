const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
