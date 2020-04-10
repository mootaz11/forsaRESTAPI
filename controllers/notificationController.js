
const notificationModel = require("../models/notification");
const mongoose = require("mongoose");
const userModel = require("../models/user");


exports.NotificationsSeen=async function(req,res){
    var notifications= await notificationModel.find({idreceiver:req.params.iduser});
    notifications.forEach(async notif=>{
        await notificationModel.findOneAndUpdate({_id:notif._id},{$set:{seen:true}});
    })
    return res.status(200).send({message:"notifications seen"})
}

exports.createNotification=function(data)
{    data = JSON.parse(data)
    console.log(data)
    const notification = new notificationModel({
        _id:new mongoose.Types.ObjectId(),
        message:data.message,
        idsender:data.idsender,
        idreceiver:data.idreceiver,
        date:data.date,
        idpost:data.idpost,
        idrequest:data.idrequest,
        seen:false
    })
    notification.save()
    .then(result=>{
        return result;                
 })
    .catch(err=>{
        throw err;
    })
}

exports.getAllnotifs= async function(req,res)
{   var messagesSearchs=[];
    var messages = await notificationModel.find();
    var users=await userModel.find();
    messages.forEach(message=>{
                  if(message.idreceiver==req.params.iduser) 
                  {messagesSearchs.push({message:message,friend:message.idsender});} 
                }
         );
    var messagesSearchs=messagesSearchs.reverse();
    var messageBox=[];
    messagesSearchs.forEach( message=>{
        const index2=users.findIndex(user=> user._id.toString()==message.friend)
        messageBox.push({message,user:users[index2]});
    })
    if(messageBox.length>req.params.lengthbox){
    messageBox=messageBox.splice(messageBox.length-req.params.lengthbox,messageBox.length)}
        return res.send(messageBox);
    }