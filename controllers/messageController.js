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

exports.getFriendsMessages=async function(req,res){
    var messageBox = [];
    const user = await  userModel.findById(req.params.iduser);
    var friendlist=user.friendlist
    var messages = await messageModel.find();
        messages=messages.reverse();
        for(let j= 0 ; j<friendlist.length;j++)
        {
                    const index = messages.findIndex(message=> (message.idsender.toString()===friendlist[j].iduser.toString())
                    &&(message.idreceiver.toString()===req.params.iduser.toString()));                    
                    const friend = await userModel.findById(friendlist[j].iduser);
                    messageBox.push({message:messages[index],friend:friend});
                    messages=messages.filter(message=>{
                        return message.idsender!==friendlist[j].iduser
                   });
        }    
        return res.status(200).json(messageBox.slice(0,req.params.lengthbox));
    }




exports.getMessagesfromOthers= async function(req,res)
{   var messageBox=[];
    const users = await userModel.find({_id:{$nin:[req.params.iduser]}});
    var messages = await messageModel.find();
    var other_profiles=[]
    users.forEach(user=>{
        if((user.friendlist.findIndex(friend=> friend.iduser.toString() === req.params.iduser.toString() ))===-1)
        {
        other_profiles.push(user);
        }
      });
      for(let j= 0 ; j<other_profiles.length;j++)
      {
                  const index = messages.findIndex(message=>
                    message.idsender.toString() === other_profiles[j]._id.toString()
                    &&(message.idreceiver.toString()===req.params.iduser.toString())
                    );                    

                  if(index>=0)
                {
                    messageBox.push({message:messages[index],friend:other_profiles[j]});
                    messages=messages.filter(message=>{
                    return message.sender.toString()!==other_profiles[j]._id.toString()
                   });
                }
        }    
        return res.status(200).json(messageBox);
      
    }
















