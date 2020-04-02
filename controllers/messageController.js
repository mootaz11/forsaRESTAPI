const messageModel = require("../models/message");
const mongoose = require("mongoose");
const userModel = require("../models/user");


exports.createMessageRealtime=function(data)
{    data = JSON.parse(data)

    const message = new messageModel({
        _id:new mongoose.Types.ObjectId(),
        message:data.message,
        idsender:data.idsender,
        idreceiver:data.idreceiver,
        date:data.date
    })
    message.save()
    .then(result=>{
        return result;                
 })
    .catch(err=>{
        throw err;
    })
}

exports.getConversation=async function(req,res){
    var conversation =[];
    const messages = await  messageModel.find();
    if(messages.length>0){
    messages.forEach(message=>{
        if((message.idsender==req.params.idsender && message.idreceiver ==req.params.idreceiver)
        || (message.idsender==req.params.idreceiver && message.idreceiver==req.params.idsender))
        {
            conversation.push(message);
        }
    }
    )}
if(conversation.length>req.params.lengthmsgs){
    conversation=conversation.splice(conversation.length-req.params.lengthmsgs,conversation.length)
}  
res.send(conversation);
}





exports.getMessagesfromOthers= async function(req,res)
{   var messagesSearchs=[];
    var messages = await messageModel.find();
    var users=await userModel.find();
    messages.forEach(message=>{
                  if(message.idsender==req.params.iduser) 
                    {messagesSearchs.push({message:message,friend:message.idreceiver});}
                  if(message.idreceiver==req.params.iduser) 
                  {messagesSearchs.push({message:message,friend:message.idsender});} 
                }
         );
    
    messagesSearchs=messagesSearchs.reverse();
    var messageBox=[];
    messagesSearchs.forEach( message=>{
        const index=messageBox.findIndex(messagebox=> messagebox.user._id.toString()==message.friend.toString())
        if(index==-1)
        {const index2=users.findIndex(user=> user._id.toString()==message.friend)
        messageBox.push({message,user:users[index2]});}
    })
    if(messageBox.length>req.params.lengthbox){
    messageBox=messageBox.splice(messageBox.length-req.params.lengthbox,messageBox.length)}
        return res.send(messageBox);
    }















