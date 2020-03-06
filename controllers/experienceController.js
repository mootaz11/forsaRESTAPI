const experienceModel = require("../models/experience");
const mongoose = require("mongoose");
const userModel= require("../models/user");

exports.createExperience=function(req,res){
    const experience = new experienceModel({
        _id:new mongoose.Types.ObjectId(),
        title:req.body.title,
        duration:req.body.duration,
        description:req.body.description

    });
    
    experience.save()
    .then(experience=>{
        if(experience){
            userModel.findByIdAndUpdate(req.params.iduser,{$push:{experiences:experience}})
            .exec()
            .then(result=>{
                if(result){
                    return res.status(200).json({message:'experience created done ',experience});
                }
                else 
                    return res.status(400).json({message:'experience failed '});
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

exports.updateExperience=function(req,res){
experienceModel.findByIdAndUpdate(req.params.idexperience,{$set:{title:req.body.title,duration:req.body.duration,description:req.body.description}})
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
exports.showExperience=function(req,res){
experienceModel.findById(req.params.idexperience)
.exec()
.then(experience=>{
    if(experience){
        return res.send(experience);
    }
    else {
        return res.status(404).json({message:"experience not found"})
    }
})
.catch(err=>{
    res.status(500).json({err});
})

}

exports.deleteExperience=function(req,res)
{
    userModel.findOneAndUpdate({experiences:{$in:[req.params.idexperience]}},{$pull:{experiences:req.params.idexperience}})
    .exec()
    .then(result=>{
        if(result){
            experienceModel.findByIdAndRemove(req.params.idexperience,(err,exp)=>{
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
exports.showAllexperiencesByuser=function(req,res)
{
    experienceModel.find({user:req.params.iduser})
    .exec()
    .then(experiences=>{
        if(experiences.length>0){
            return res.status(200).json({experiences});

        }
        else {
            return res.status(404).json({message:'experiences not found'});
        }
        
    })
    .catch(err=>{return res.status(500).json(err)})
}
