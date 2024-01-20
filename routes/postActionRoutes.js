const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const postActionRouter = express.Router();

require('dotenv').config();


//models
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Event = require('../models/eventModel');

//socket
const socket = require('../socket');
//like Post route
postActionRouter.post("/:postId/like", async(req,res) => {
    try {
    //get values from param, header
      const postId = req.params.postId;
      const token = req.headers.authorization.split(" ")[1];
  
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decodedToken);
      const decodedUser = decodedToken.id;
      const user = await User.findOne({email: decodedUser.email});
      console.log(user);
      if(!user.likePostsId.includes(postId)) {
        const post = await Post.findOneAndUpdate({id: postId},{$inc: {heart: 1}});
    
        if(!post) {
          return res.status(404).send({message: "Post not found!"});
        }
        //postId zum Array des jeweiligen user hinzufügen
        await user.likePostsId.push(postId);
        await user.save();
        res.status(200).send({message: "Like gesetzt!"});
      }
      else {
        //Wie kann ich den Like aus dem post wieder zurücknehmen
        //Wie kann ich die postId wieder entfernen aus dem
        return res.status(401).send({message: "Post schon geliked!"});
      }   
    } catch(e) {
      res.status(500).send({message: "Internal Server Error!"});
    }
})
postActionRouter.post("/comment", async(req,res) => {
    try {
      const {postId,comment,time} = req.body;
      const token = req.headers.authorization.split(" ")[1];
      const decodedTokenId  = jwt.verify(token,process.env.JWT_SECRET).id
      const user = decodedTokenId.fullname;
      const post = await Post.findOneAndUpdate({id: postId},{$push: 
        { 
          comments: {
            user: user,
            commented: comment,
            timeStamp: time
          }
        }
      });
      console.log(post);
      res.status(200).send({message: "Commented Post!"})
    } catch(e) {
      res.status(500).send({message: "Internal Server Error!"});
    }
})
  
  
postActionRouter.get("/check",(req,res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id.fullname;
  
      if(userId) {
        res.status(200).send({userId});
      } else {
        res.status(409).send({message: "User not found"});
      }
    } catch(e) {
      res.status(500).send({message: "Internal Server Error!"});
    }
})
  
postActionRouter.delete('/delete/:postId', async(req,res) => {
    try {
      const {postId} = req.params;
      console.log(postId)
      await Post.findOneAndDelete({id: postId});
      res.status(200).send({message: "post deleted!"});
    } catch(e) {
      res.status(409).send({message: 'Post not found!'});
    }
})

postActionRouter.post('/createEvent', async(req,res) => {
  try{
    const io = socket.getIo();
    const userToken = req.headers.authorization.split(" ")[1];
    let {eventName,timeFrom,timeTo,date,participants,additionalInfo} = req.body;
    date = date.split("T")[0];
    if(!eventName || !userToken ||!date || !participants) {
      return res.status(401).send({"message": "Information is misssing!"});
    };
    const decodedToken = jwt.verify(userToken,process.env.JWT_SECRET);
    if(!decodedToken || decodedToken == null || decodedToken == undefined) {
      return res.status(401).send({
        "message": "User does not exist!"
      })
    }
    const owner = decodedToken.id.fullname;
    const event = new Event({eventName,owner,date,timeFrom,timeTo,participants,additionalInfo})
    await Event.create(event);
    io.emit('new-event-created', { message: 'New user!'});
    res.status(200).send({"message": "Event created!"});

  } catch(e) {
    console.log(`Error:\n${e}`);
  }
})

module.exports = postActionRouter;