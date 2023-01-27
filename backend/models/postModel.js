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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // required: true,
  },
});

const PostModel = mongoose.model('post', PostSchema);

module.exports = PostModel;
