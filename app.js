const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose'); 
const http = require('http');
const socket = require('./socket');
require('dotenv').config()

//import routers
const postRouter = require('./routes/postRoutes');
const postActionRouter = require('./routes/postActionRoutes');
const registerRouter = require('./routes/registerRoutes');
const loginRouter = require('./routes/loginRoutes');
const resetRouter = require('./routes/resetRoutes');
const testRouter = require('./routes/testRoutes');
const userInformationRouter = require('./routes/userInformationRoutes');
const chatRouter = require('./routes/chatRoutes');


app.use(cors());
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT;
const server = http.createServer(app);
const io = socket.init(server);




app.use(async function(req,res,next) {
    await mongoose.connect(process.env.CONNECT_STRING,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    next()
})

//routes für testen der app
app.use('/test',testRouter);

//post routes
app.use('/api/posts',postRouter);

app.use(express.json());
//register routes
app.use("/api/register",registerRouter);
//login routes
app.use("/api/login",loginRouter);
//reset routes
app.use("/api/auth/reset",resetRouter);
//postaction routes
app.use("/api/postAction",postActionRouter);

app.use("/api/userInformation",userInformationRouter);

app.use("/api/chatbot",chatRouter);

io.on('connection', client => {
    console.log("Connected to server");
    //socket.id refers the unique id created for every newly established socket
    //client.on('message',(data) => io.emit('response', data)  )
    client.on('disconnect', () => console.log("Disconnected from server"));
  });

module.exports = io;

server.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

