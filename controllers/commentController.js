const commentModel= require('../models/comment');
const mongoose=require("mongoose");
const userModel = require("../models/user");
const projectModel = require("../models/project");
const jobModel = require("../models/job");


exports.CreateCommentOnProject=  function(req,res)
{
    comment = new commentModel({
        _id:new mongoose.Types.ObjectId(),
        time:new Date().getTime(),
        content:req.body.content,
        user:req.params.userid,
        project:req.params.projectid
    })
    comment.save()
    .then(async comment=>{
        if(comment)
        {   await userModel.findByIdAndUpdate(req.params.userid,{$push:{comments:comment}});
            await projectModel.findByIdAndUpdate(req.params.projectid,{$push:{comments:comment}});

            return res.status(201).json({message:'comment created successfully',comment});

        }
        else {
            return res.status(400).json({message:'comment failed'});
        }

    })
    .catch(err=>{
        return res.status(500).json(err);
    });

}


exports.CreateCommentOnJob= function(req,res)
{
    comment = new commentModel({
        _id:mongoose.Types.ObjectId(),
        time:new Date().getDate(),
        content:req.body.content,
        user:req.params.userid,
        job:req.params.jobid
    })
    comment.save()
    .then(async comment=>{
        if(comment)
        {
            await userModel.findByIdAndUpdate(req.params.userid,{$push:{comments:comment}});
            await jobModel.findByIdAndUpdate(req.params.jobid,{$push:{comments:comment}});
            
            return res.send({message:'comment created',comment});

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
    commentModel.find({project:req.params.projectid})
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
    commentModel.find({job:req.params.jobid})
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

exports.updateComment=function(req,res){
    commentModel.findByIdAndUpdate(req.params.idcomment,{$set:{content:req.body.content}})
    .exec()
    .then(comment=>{
        if(comment)
        {
            return res.status(200).json({comment});
        }
        else {
            return res.status(401).json({message:'update failed'});
        }
    })
    .catch(err=>{return res.status(500).json(err)});
}
exports.deleteCommentFromJob=function(req,res){
    commentModel.findByIdAndRemove(req.params.idcomment)
    .exec()
    .then(async result =>{
        if(result){
            await userModel.findByIdAndUpdate(req.params.iduser,{$pull:{comments:req.params.idcomment}});
            await jobModel.findByIdAndUpdate(req.params.idjob,{$pull:{comments:req.params.idcomment}});
            return res.status(200).json({message:'delete successfully'});
        }

        else {
            return res.status(401).json({message:'delete failed'});
        }
    })
    .catch(err=>{return res.status(500).json(err)})

}



exports.deleteCommentFromProject=function(req,res){
    commentModel.findByIdAndRemove(req.params.idcomment)
    .exec()
    .then(async result =>{
        if(result){
            await userModel.findByIdAndUpdate(req.params.iduser,{$pull:{comments:req.params.idcomment}});
            await projectModel.findByIdAndUpdate(req.params.idproject,{$pull:{comments:req.params.idcomment}});
            return res.status(200).json({message:'delete successfully'});
        }

        else {
            return res.status(401).json({message:'delete failed'});
        }
    })
    .catch(err=>{return res.status(500).json(err)})
}