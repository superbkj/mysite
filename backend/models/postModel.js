const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  lead: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

const PostModel = mongoose.model('post', PostSchema);

module.exports = PostModel;
