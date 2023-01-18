const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const PostModel = mongoose.model("post", PostSchema);

module.exports = PostModel;