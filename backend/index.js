const express=require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const ws = require('ws');
const fs = require('fs');
const cors =require('cors')
const jwt=require("jsonwebtoken")
const app=express()
const router=require('./routes/chats')
const Message=require('./models/message')


require('dotenv').config()
const jwtSecret=process.env.SECRET;

app.use(express.json());
app.use(cookieParser());

const port=process.env.PORT

const server=app.listen(port, () =>
  console.log(`Server is listening on port ${port}...`)
)

app.use(cors({
  origin:'https://message-web-app-7iwo.vercel.app',
  methods:['GET','POST','PATCH','DELETE'],
  allowedHeaders:['Content-Type'],    
  credentials:true,
}))

app.use('/api/v1/chats',router)

const wss=new ws.WebSocketServer({server})
wss.on('connection',(connection,req)=>{
  console.log("connected")
  const notifyAll=()=>{
    wss.send(JSON.stringify({
      online:[...wss.clients].map((client)=>({userId:client.userId,username:client.username}))
    }))      
  }
  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAll();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    const token=tokenCookieString.split('=')[1];  
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        const {userId, username} = userData;
        connection.userId = userId;
        connection.username = username;
      });
    }
  }

  connection.on('message', async (message) => {
    
    console.log("message")
    const messageData = JSON.parse(message.toString());
    const {sender,recipient, text, file} = messageData;
    let filename = null;
    if (file) {
      console.log('size', file.data.length);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.'+ext;
      const path = __dirname + '/uploads/' + filename;
      const bufferData = new Buffer(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('file saved:'+path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender,
        reciever:recipient,
        text,
        file: file ? filename : null,
      });
      const conns=[...wss.clients].filter(c => c.userId === recipient)
      conns.forEach(c => 
        c.send(JSON.stringify({
          text,
          sender,
          recipient,
          file: file ? filename : null,
          _id:messageDoc._id,
      })));
      
    }  
  })
  notifyAll()
})  

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

start();

