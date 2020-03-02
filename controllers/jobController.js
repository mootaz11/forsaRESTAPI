const jobModel = require("../models/job");
const mongoose = require("mongoose");
const userModel= require("../models/user");

exports.createJob=function(req,res){
    const job = new jobModel({
        _id:mongoose.Types.ObjectId(),
        title:req.body.title,
        category:req.body.category,
        skills:req.body.skills,
        price:req.body.price,
        time:req.body.time,
        description:req.body.description

    });
    job.save()
    .then(job=>{
        if(job){
            userModel.findByIdAndUpdate(req.params.iduser,{$push:{jobs:job}})
            .exec()
            .then(result=>{
                if(result){
                    return res.status(200).json({message:'job created done ',job});
                }
                else 
                    return res.status(400).json({message:'job creation failed '});
            })
            .catch(err=>{
                return res.status(500).json({err});
            })
        }
    })
    .catch(err=>{
        return res.status(500).json({err});  
    })
}

exports.updateJob=function(req,res){
jobModel.findByIdAndUpdate(req.params.idjob,{$set:{title:req.body.title,category:req.body.category,skills:req.body.skills,price:req.body.price,time:req.body.time,description:req.body.description}})
.exec()
.then(result=>{
    if(result){
        return res.status(200).json({message:'update done '});
    }
    else {
        return res.status(400).json({message:'update failed'});
    }
})
.catch(err=>{
    return res.status(500).json({err});  
})
}
exports.showJob=function(req,res){
jobModel.findById(req.params.idjob)
.exec()
.then(job=>{
    if(job){
        return res.send(job);
    }
    else {
        return res.status(404).json({message:"job not found"})
    }
})
.catch(err=>{
    res.status(500).json({err});
})

}

exports.deleteJob=function(req,res)
{
    userModel.findOneAndUpdate({jobs:{$in:[req.params.idjob]}},{$pull:{jobs:req.params.idjob}})
    .exec()
    .then(result=>{
        if(result){
            jobModel.findByIdAndRemove(req.params.idjob,(err,exp)=>{
                if(err){
                    return res.status(500).json(err);
                }
                if(exp){
                    return res.status(200).json({message:'update done'});
                }
                else {
                    return res.status(400).json({message :'update failed'});
                }
            })
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}
exports.showJobsByUser=function(req,res)
{
    jobModel.find({user:req.params.iduser})
    .exec()
    .then(jobs=>{
        if(jobs.length>0){
            return res.status(200).json({jobs});

        }
        else {
            return res.status(404).json({message:'jobs not found'});
        }
        
    })
    .catch(err=>{return res.status(500).json(err)})
}
