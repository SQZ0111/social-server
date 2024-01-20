const express = require('express');
const testRouter = express.Router();



testRouter.get("/",(req,res) => {
    res.send("hallo Welt");
})



module.exports = testRouter;
