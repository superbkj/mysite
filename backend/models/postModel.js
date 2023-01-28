const mongoose = require('mongoose');

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
PostSchema.pre('validate', function (next) {
  // In below case, 'this' will be
  // current file if inside arrow function, which is not expected
  // caller object (post instance) if inside 'function' function, which is expected
  const post = this;
  const merged = `${post.title}${post.lead}${post.text}`;
  post.merged = merged;
  // the next() call does not stop the rest
  // of the code in your middleware function from executing
  // unless you 'return' it
  return next();
});

const PostModel = mongoose.model('post', PostSchema);

module.exports = PostModel;
