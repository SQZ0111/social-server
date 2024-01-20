//node imports
const express = require('express');
const multer = require('multer');
const postRouter = express.Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();
//models
const Post = require("../models/postModel");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});
  
const upload = multer({ storage });

postRouter.post("/", upload.single("image"), async (req, res) => {
    console.log(req);
    const { id, title, location, instagramLink, price,heart} = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken  = jwt.verify(token,process.env.JWT_SECRET);
    const createdBy = decodedToken.id.fullname;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const post = new Post({id, title, location, instagramLink, price, imageUrl,heart,createdBy });
    try {
      const newPost = await Post.create(post);
      res.sendStatus(201);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});
postRouter.get("/", async (req, res) => {
    try {
      const posts = await Post.find();
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});

module.exports = postRouter;