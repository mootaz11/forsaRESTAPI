const commentModel= require('../models/comment');
const mongoose=require("mongoose");

exports.CreateCommentOnProject=function(req,res)
{
    comment = new commentModel({
        _id:new mongoose.Types.ObjectId(),
        time:new Date().getDate(),
        content:req.body.content,
        user:req.body.userid,
        project:req.body.projectId
    })
    comment.save()
    .then(comment=>{
        if(comment)
        {
            return res.status(201).json({message:'comment created successfully'});

        }
        else {
            return res.status(400).json({message:'comment failed'});
        }

    })
    .catch(err=>{
        return res.status(500).json(err);
    });

}


exports.CreateCommentOnJob=function(req,res)
{

    comment = new commentModel({
        _id:mongoose.Types.ObjectId(),
        time:new Date().getDate(),
        content:req.body.content,
        user:req.body.userid,
        job:req.body.jobId
    })
    comment.save()
    .then(comment=>{
        if(comment)
        {
            return res.status(201).json({message:'comment created successfully'});

        }
        else {
            return res.status(400).json({message:'comment failed'});
        }

    })
    .catch(err=>{
        return res.status(500).json(err);
    });

}

exports.getCommentsByproject=function(req,res){
    commentModel.find({project:req.params.projectId})
    .exec()
    .then(comments=>{
        if(comments.length>0)
        {
            return res.status(200).json({comments});
        }
        else {
            return res.status(404).json({message:'comments not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })

}
exports.getCommentsByJob=function(req,res){
    commentModel.find({job:req.params.jobId})
    .exec()
    .then(comments=>{
        if(comments.length>0)
        {
            return res.status(200).json({comments});
        }
        else {
            return res.status(404).json({message:'comments not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })

}