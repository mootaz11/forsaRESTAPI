const skillModel = require("../models/skill");
const mongoose = require("mongoose");
const userModel= require("../models/user");

exports.createskill=function(req,res){
    const skill  = new skillModel({
        _id:new mongoose.Types.ObjectId(),
        title:req.body.title,
        user:req.params.iduser

    });
    skill.save()
    .then(skill=>{
        if(skill){
            userModel.findByIdAndUpdate(req.params.iduser,{$push:{skills:skill}})
            .exec()
            .then(result=>{
                if(result){
                    return res.status(200).json({message:'skill created done ',result});
                }
                else 
                    return res.status(400).json({message:'skill creation failed '});
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

exports.updateskill=function(req,res){    
skillModel.findByIdAndUpdate(req.params.idskill,{$set:{title:req.body.title}})
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
exports.showskill=function(req,res){
skillModel.findById(req.params.idskill)
.exec()
.then(skill=>{
    if(skill){
        return res.send(skill);
    }
    else {
        return res.status(404).json({message:"skill not found"})
    }
})
.catch(err=>{
    res.status(500).json({err});
})

}

exports.deleteskill=function(req,res)
{
    userModel.findOneAndUpdate({skills:{$in:[req.params.idskill]}},{$pull:{skills:req.params.idskill}})
    .exec()
    .then(result=>{
        if(result){
            skillModel.findByIdAndRemove(req.params.idskill,(err,exp)=>{
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
exports.showskillsByUser=function(req,res)
{
    console.log(req.params.iduser);
    skillModel.find({user:req.params.iduser})
    .exec()
    .then(skills=>{
        if(skills.length>0){
            return res.status(200).json({skills});
        }
        else {
            return res.status(404).json({message:'skills not found'});
        }
        
    })
    .catch(err=>{return res.status(500).json(err)})
}
