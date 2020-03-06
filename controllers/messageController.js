const messageModel = require("../models/message");
const mongoose = require("mongoose");


exports.createMessage=function(req,res)
{
    messageModel = new messageModel({
        _id:new mongoose.Types.ObjectId(),
        text:req.body.text,
        sentBy:req.body.userId,
        sentTo:req.body.friendId
    })
    messageModel
    .save()
    .then(result=>{
        if(result)
        {
            return res.status(201).json({message:'done'});
        }
        else
        {
            res.status(400).json({message:'failed'});
        }

    })
    .catch(err=>{
        return res.status(500).json(err);
    })

}

exports.deleteConversation= function(req,res)
{
    messageModel.deleteMany({sentBy:req.body.userId,sentTo:req.body.sentTo},(err,result)=>{
        if(err){
            throw new Error({message:'error has been occured'});
        }
        if(result){
            return res.status(200).json({message:'conversation deleted successfully'});
        }
        else {
            return res.status(400).json({message:'delete failed'});
        }

    })
}

exports.getConversation=function(req,res){
    messageModel.find({sentBy:req.body.userId,sentTo:req.body.sentTo})
    .exec()
    .then(messages=>{
        if(messages)
        {
            return res.status(200).json({messages});
        }
        else {
            return res.status(404).json({message:'no conversation'})
        }
    })

}

