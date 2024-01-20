const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginRouter = express.Router();
require('dotenv').config();
//model
const User = require('../models/userModel');

loginRouter.post("/", async(req,res) => {
    const {email, password}  = req.body;
    if(!email || !password) {
      return res.status(409).message({message: "Fill out all fields"});
    }
    //check if user exists
    const userExist = await User.findOne({email});
    if (!userExist) {
      return res.status(404).send({message: "User does not exist"});
    }
    //check if password is equal to hashed pw
    const isPasswordCorrect = await bcrypt.compare(password,userExist.hashPassword);
    if(!isPasswordCorrect) {
      return res.status(401).send({message: "Password incorrect"})
    }
    //jwt token
    const token = jwt.sign({id: userExist},process.env.JWT_SECRET);
    res.status(200).send({token,message: "Login Sucessful"});

})

module.exports = loginRouter;