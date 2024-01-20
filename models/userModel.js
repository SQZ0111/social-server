const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlegth: 8,
      maxlength: 50,
    },
    hashPassword: {
      type: String,
      required: true,
      minlenth: 5,
    },
    id: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["student","parent","admin"]
    },
  
    likePostsId: {
      type: Array,
      default: []
    }, 
  })
  
const User = mongoose.model("User", userSchema);

module.exports = User;