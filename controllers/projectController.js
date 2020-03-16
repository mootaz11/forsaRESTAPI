const projectModel = require("../models/project");
const mongoose = require("mongoose");
const userModel= require("../models/user");



exports.getTopProjects=async function(req,res){

    const projects = await projectModel.find();
    const topprojects = [];
    var top = req.params.top;
    
    for(var i =0;i<top ; i++)
    {
        var max = projects[0];
        for(var j=1;j<projects.length;j++)
        {
            if(max.likes.length<=projects[j].likes.length)
            {
                max = projects[j];
            }
        }
        topprojects.splice(projects.indexOf(max),1);
        topprojects.push(max);
    }
    return res.send(topprojects);
}







exports.getLikesByProject=function(req,res)
{
projectModel.findById(req.params.idproject)
.exec()
.then(project=>{
    if(project){
        return res.status(200).json({likes : project.likes});
    }
    else {

        return res.status(404).json({message:'project not found'});
    
    }
})
.catch(err=>{return res.status(500).json({err})});

}

exports.addLike=async function(req,res){
    const user = await userModel.findById(req.params.userid);
    projectModel.findByIdAndUpdate(req.params.idproject,{$push:{likes:{username:user.fullname,image:user.image}}})
    .exec()
    .then(result=>{
        if(result){
            return res.send(result.likes);
        }
        else {
            return res.status(400).json({message:'update failed'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    });
}

exports.createProject=function(req,res){
    const project  = new projectModel({
        _id:new mongoose.Types.ObjectId(),
        title:req.body.title,
        category:req.body.category,
        skills:req.body.skills,
        price:req.body.price,
        toprice:req.body.toprice,
        description:req.body.description,
        likes:[],
        user:req.params.iduser,
        createdAt:new Date().getTime()
    });
    project.save()
    .then(project=>{
        if(project){
            userModel.findByIdAndUpdate(req.params.iduser,{$push:{projects:project}})
            .exec()
            .then(result=>{
                if(result){
                    return res.status(200).json({message:'project created done ',project});
                }
                else 
                    return res.status(400).json({message:'project creation failed '});
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

exports.updateproject=function(req,res){    
projectModel.findByIdAndUpdate(req.params.idproject,{$set:{title:req.body.title,category:req.body.category,skills:req.body.skills,price:req.body.price,toprice:req.body.toprice,description:req.body.description}})
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
exports.showProject=function(req,res){
projectModel.findById(req.params.idproject)
.exec()
.then(project=>{
    if(project){
        return res.send(project);
    }
    else {
        return res.status(404).json({message:"project not found"})
    }
})
.catch(err=>{
    res.status(500).json({err});
})

}

exports.deleteproject=function(req,res)
{
    userModel.findOneAndUpdate({projects:{$in:[req.params.idproject]}},{$pull:{projects:req.params.idproject}})
    .exec()
    .then(result=>{
        if(result){
            projectModel.findByIdAndRemove(req.params.idproject,(err,exp)=>{
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
exports.showprojectsByUSer=function(req,res)
{
    projectModel.find({user:req.params.iduser})
    .exec()
    .then(projects=>{
        if(projects.length>0){
            return res.status(200).json({projects});

        }
        else {
            return res.status(404).json({message:'projects not found'});
        }
        
    })
    .catch(err=>{return res.status(500).json(err)})
}
