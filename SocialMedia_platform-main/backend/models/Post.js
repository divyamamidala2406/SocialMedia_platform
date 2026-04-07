const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  username: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  caption: String,
  image: String,

  likes: [
    {
      type: String   // store username who liked
    }
  ],

  comments: [CommentSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", PostSchema);