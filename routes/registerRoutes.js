const express = require('express');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
 
const registerRouter = express.Router();

//model
const User = require('../models/userModel.js');

//websocket
const socket = require('../socket.js');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 20,
})

registerRouter.post("/", limiter, async(req,res) => {
    //console.log(req.body);
  
    try {
      const io = socket.getIo();
      const {id,fullname,email,password,role} = req.body;
      
      if(!id || !fullname || !email || !password || !role) {
        return res.status(404).send({message: "Please all fields"});
      }
      const existingUser = await User.findOne({email});
      if(existingUser) {
        return res.status(409).send({message: "User already exists"});
      }
      
      const hashPassword = await bcrypt.hash(password,10);
      const user = new User({id,fullname,email,hashPassword,role});
      
      const userCreated = await User.create(user);
      io.emit('new-user-registered', { message: 'New user!'});
      res.status(201).send({message: "User successfully created"});
    } catch(error) {
      res.status(500).send({message: "Server register failed"});
    }
   
});

module.exports = registerRouter;