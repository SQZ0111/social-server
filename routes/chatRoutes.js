const express = require('express');
const { OpenAI }  = require('openai');
const chatRouter = express.Router();
require('dotenv').config();

const configuration = new OpenAI({
    apiKey: process.env.CHATGPT_SECRET_KEY,
  });
const openai = new OpenAI(configuration);

chatRouter.post('/', async (req, res) => {
    try {
        const messageHistory = req.body.messageHistory;
        console.log(messageHistory);
        const response = await openai.chat.completions.create({
            model: "gpt-4", 
            messages: messageHistory,
            temperature: 0.6
        });
        console.log("Response:", response);
        const messageObject = response.choices[0].message;
        console.log("Message Object:", messageObject);

        const botReply = messageObject.content;

        res.status(200).send({ "reply": botReply });
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = chatRouter;