const mongoose = require('mongoose'); 

const postSchema = new mongoose.Schema({
    id: String,
    title: String,
    location: String,
    instagramLink: String,
    price: String,
    imageUrl: String,
    heart: Number,
    comments: {
      type: Array,
      default: []
    },
    createdBy: String
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;