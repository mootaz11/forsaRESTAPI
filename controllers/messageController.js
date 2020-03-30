const messageModel = require("../models/message");
const mongoose = require("mongoose");
const userModel = require("../models/user");


exports.createMessageRealtime=function(data)
{    data = JSON.parse(data)

    const message = new messageModel({
        _id:new mongoose.Types.ObjectId(),
        text:data.message,
        sender:data.idsender,
        receiver:data.idreceiver,
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
        if((message.sender===req.params.user && message.receiver ===req.params.friend)
        || (message.sender===req.params.friend && message.receiver===req.params.user))
        {
    conversation.push(message);
        }
    }
    )
}
res.send(conversation);
}




exports.createMessageOffline=function(req,res){
    const message = new messageModel({
        _id:new mongoose.Types.ObjectId(),
        text:req.body.message,
        sender:req.params.idsender,
        receiver:req.params.idreceiver,
        date:req.body.date
    })
    message.save()
    .then(message=>{
        if(message){
            return res.status(201).json(message);
        }
        else {
            return res.status(401).json({message:'message sent failed'});
        }
    })
    .catch(err=>{return res.status(500).json(err)});
}



exports.getFriendsMessages=async function(req,res){
    var messageBox = [];
    const user = await  userModel.findById(req.params.iduser);
    var friendlist=user.friendlist
    var messages = await messageModel.find();
        messages=messages.reverse();
        for(let j= 0 ; j<friendlist.length;j++)
        {
                    const index = messages.findIndex(message=> (message.sender.toString()===friendlist[j].iduser.toString())
                    &&(message.receiver.toString()===req.params.iduser.toString()));                    
                    const friend = await userModel.findById(friendlist[j].iduser);
                    messageBox.push({message:messages[index],friend:friend});
                    messages=messages.filter(message=>{
                        return message.sender!==friendlist[j].iduser
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
                    message.sender.toString() === other_profiles[j]._id.toString()
                    &&(message.receiver.toString()===req.params.iduser.toString())
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
















