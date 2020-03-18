const jobModel = require("../models/job");
const mongoose = require("mongoose");
const userModel= require("../models/user");


exports.addLike= async function(req,res){
    const user = await userModel.findById(req.params.userid);
    jobModel.findByIdAndUpdate(req.params.idjob,{$push:{likes:{userid:user._id,username:user.fullname,image:user.image}}})
    .exec()
    .then(result=>{
        if(result){
            return res.send(result);
        }
        else {
            return res.status(400).json({message:'update failed'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    });
}

exports.gettopjobs=async function(req,res){

    const jobs = await jobModel.find();
    const topjobs = [];
    var top = req.params.top;
    
    for(var i =0;i<top ; i++)
    {
        var max = jobs[0];
        for(var j=1;j<jobs.length;j++)
        {
            if(max.likes.length<=jobs[j].likes.length)
            {
                max = jobs[j];
            }
        }
        topjobs.splice(jobs.indexOf(max),1);
        topjobs.push(max);
    }
    return res.send(topjobs);
}









exports.getLikesByJob=function(req,res)
{
jobModel.findById(req.params.idjob)
.exec()
.then(job=>{
    if(job){
        return res.status(200).json({likes : job.likes});
    }
    else {
        return res.status(404).json({message:'job not found'});
    }
})
.catch(err=>{return res.status(500).json({err})});
}

exports.createJob=function(req,res){
    const job = new jobModel({
        _id:new mongoose.Types.ObjectId(),
        title:req.body.title,
        category:req.body.category,
        skills:req.body.skills,
        price:req.body.price,
        time:req.body.time,
        user:req.params.iduser,
        description:req.body.description,
        likes:[],
        createdAt:new Date().getTime()
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
    console.log(req.body)
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

exports.dislike= async function(req,res){
    const user = await userModel.findById(req.params.userid);
    jobModel.findByIdAndUpdate(req.params.idjob,{$pull:{likes:{userid:user._id,username:user.fullname,image:user.image}}})
    .exec()
    .then(result=>{
        if(result){
            return res.send(result);
        }
        else {
            return res.status(400).json({message:'update failed'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    });
}





