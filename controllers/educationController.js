const educationModel = require("../models/education");
const mongoose = require("mongoose");
const userModel= require("../models/user");

exports.createEducation=function(req,res){
    const education = new educationModel({
        _id:mongoose.Types.ObjectId(),
        title:req.body.title,
        duration:req.body.duration,
        description:req.body.description

    });
    education.save()
    .then(education=>{
        if(education){
            userModel.findByIdAndUpdate(req.params.iduser,{$push:{educations:education}})
            .exec()
            .then(result=>{
                if(result){
                    return res.status(200).json({message:'education created done ',education});
                }
                else 
                    return res.status(400).json({message:'education failed '});
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

exports.updateEducation=function(req,res){
educationModel.findByIdAndUpdate(req.params.ideducation,{$set:{title:req.body.title,duration:req.body.duration,description:req.body.description}})
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
exports.showEducation=function(req,res){
educationModel.findById(req.params.ideducation)
.exec()
.then(education=>{
    if(education){
        return res.send(education);
    }
    else {
        return res.status(404).json({message:"education not found"})
    }
})
.catch(err=>{
    res.status(500).json({err});
})

}

exports.deleteEducation=function(req,res)
{
    userModel.findOneAndUpdate({educations:{$in:[req.params.ideducation]}},{$pull:{educations:req.params.ideducation}})
    .exec()
    .then(result=>{
        if(result){
            educationModel.findByIdAndRemove(req.params.ideducation,(err,exp)=>{
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
exports.showAllEducationsByUser=function(req,res)
{
    educationModel.find({user:req.params.iduser})
    .exec()
    .then(educations=>{
        if(educations.length>0){
            return res.status(200).json({educations});

        }
        else {
            return res.status(404).json({message:'educations not found'});
        }
        
    })
    .catch(err=>{return res.status(500).json(err)})
}
