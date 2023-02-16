const mongoose = require('mongoose');
const UserModel = require('./userModel');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  lead: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  username: {
    type: String,
    ref: 'user',
    required: true,
  },
  merged: {
    type: String,
    required: true,
  },
});

// Use pre('validate') instead of pre('save')
// to set the value for the required field.
// Mongoose validates documents before saving.
PostSchema.pre('validate', async function (next) {
  // In below case, 'this' would be
  // current file if inside arrow function, which is not expected
  // caller object (post instance) if inside 'function' function, which is expected
  const { username } = await UserModel.findById(this.userId).select('username');
  this.username = username;

  const merged = `${this.title}${this.lead}${this.text}${this.username}`;
  this.merged = merged;
  // the next() call does not stop the rest
  // of the code in your middleware function from executing
  // unless you 'return' it
  return next();
});

const PostModel = mongoose.model('post', PostSchema);

module.exports = PostModel;
