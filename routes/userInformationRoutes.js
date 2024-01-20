const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const userInformationRouter = express.Router();
require('dotenv').config();

//model
const User = require('../models/userModel');
const Event = require('../models/eventModel');




userInformationRouter.get("/",(req,res) => {
    try {

        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(401).send({"message": "Please log in!"})
        }
        
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET).id;
        if(!decodedToken) {
            return res.status(404).send({"message": "No valid User found!"})
        }
        const userName = decodedToken.fullname;
        res.status(200).send({"message": "User found","username": userName});
    } catch(e) {
        return res.status(500).send({"message": "Server Error occured"});
    }

})

userInformationRouter.get("/usernames", async(req,res) => {
    try {
        const users = [];
        const foundUsers = await User.find({})
        foundUsers.forEach((user) => {
            if(!users.includes(user.fullname))  users.push(user.fullname)
        });
        res.status(200).send({"users": users});
    } catch(e) {
        res.status(500).send({"message": "Server Error occured"});
    }
})

userInformationRouter.get("/getEvents",async(req,res) => {
    // let status;
    //user should only receive events when mentioned in the participants
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            // Instead of return error with message throw error and give to catch block (into e)
            // status = 401;
            // throw new Error("Please Log in");
            return res.status(401).send({"message": "Please log in"});
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken) {
            return res.status(404).send({"message": "No valid user found!"});
        }
        //get user to filter the events
        const userName = decodedToken.id.fullname;
        //events - filter with mongodb operator https://www.mongodb.com/docs/manual/reference/operator/query/
        const eventsForUser = await Event.find({participants: {$in: [userName]}});
        if(!eventsForUser) {
            return res.status(401).send({"message": "No events for this user found!"});
        }
        res.status(200).send({"events": eventsForUser});
    } catch(e) {
        res.status(500).send
    }
})

module.exports = userInformationRouter;