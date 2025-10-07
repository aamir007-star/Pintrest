const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,     // title is required
    trim: true          // removes extra spaces
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,       // store image URL or path
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now   // auto-add current date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"         // reference to user model
  }
});

module.exports = mongoose.model("post", postSchema);
