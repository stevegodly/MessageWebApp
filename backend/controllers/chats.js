const asyncWrapper=require('../middleware/async')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User=require('../models/user')
const Message=require('../models/message')
require('dotenv').config()

const jwtSecret=process.env.SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const getUserData =async (req) => {
    const token = req.cookies?.token;
    if (!token) {
        console.log("No token");
        return json({ error: 'No token found' });
    }
    try {
        const userData = await jwt.verify(token, jwtSecret);
        if (!userData) {
            console.log("Token not verified");
        }
        return userData;
    } catch (error) {
        console.log("Token verification failed:", error);
        return json({ error: 'Token verification failed' });
    }
};


  
const people=asyncWrapper(async (req,res) => {
    const users = await User.find({}, {'_id':1,username:1});
    res.json(users);
});


const profile=asyncWrapper(async(req,res) => {
    
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        res.json(userData);
      });
    } else {
      res.status(401).json('no token');
    }
});

const userLogin=asyncWrapper(async(req,res,next)=>{
    const {username,password}=req.body
    const user=await User.findOne({username})
    if(!user) next(createCustomError('user not found'))
    if(bcrypt.compareSync(password,user.password)){
        jwt.sign({ userId: user._id, username }, jwtSecret, {}, (err, token) => {
            if (err) {
                return next(err);
            }
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(200).json({ id: user._id });
        });
    }
})

const registerUser = asyncWrapper(async (req, res, next) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    
    const user = await User.create({
        username: username,
        password: hashedPassword,
    });

    if (!user) {
        return next(createCustomError('User not created'));
    }

    jwt.sign({ userId: user._id, username }, jwtSecret, {}, (err, token) => {
        if (err) {
            return next(err);
        }
        res.cookie('token', token, { sameSite: 'none', secure: true }).status(200).json({ id: user._id });
    });
});


const getMessages=asyncWrapper(async(req,res,next)=>{
    const {id:rid}=req.params
    const data=await getUserData(req);
    if(!data) {
        console.log({data:data})
        next(createCustomError('no data found'))
    }
    const {userId:sid}=data
    const messages=await Message.find({sender:{$in:[sid,rid]},reciever:{$in:[sid,rid]}}).sort({createdAt: 1});
    if(!messages){
        next(createCustomError('no messages found'))
        console.log("no messgs")
    }    
    res.json(messages);
})

module.exports={profile,registerUser,userLogin,getMessages,people}


