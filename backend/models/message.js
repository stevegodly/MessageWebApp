const mongoose=require('mongoose')

const messageSchema=new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId ,ref:'use'},
    reciever:{type:mongoose.Schema.Types.ObjectId ,ref:'use'},
    text: {type:String},
    file: {type:String},
},{timestamps:true})

module.exports=mongoose.model('Message',messageSchema)