const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const fs = require("fs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); 


exports.showRequests=function(req,res){
    userModel.findById(req.params.id)
    .exec()
    .then(user=>{
        if(user)
        {   
            const requests= user.ReceivedRequests;
            return res.status(200).json({message:'requests found',requests});
        }
        else {
            return res.status(404).json({message:'user not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
    
    }



exports.searchFriend=function(req,res){
    userModel.find({"fullname": /req.body.fullname/})
    .exec()
    .then(friends=>{
        if(friends.length>0)
        {
            return res.status(200).json({friends});
        }
        else 
        {
            return res.status(404).json({message:'friends not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json({err});
    })
    }
    

exports.getAllusers=function(req,res){
userModel.find()
.exec()
.then(users=>{

    if(users.length>0){
        return res.status(200).json({users});
    }
    else {
        return res.status(200).json({});
    }
})
.catch(err=>{
    return res.status(500).json({err});
})

}
exports.signup=function(req,res){

    userModel.findOne({email:req.body.email})
.exec()
.then(user=>{
    if(user){
        res.status(409).json({message:'mail exists'});
    }

    else {
        bcrypt.hash(req.body.password,10, async (err,hashedPass)=>
        {
            if (err){
                return res.status(500).json({error:err})
            }
            else {
                   const user = new userModel({
                    _id:mongoose.Types.ObjectId(),
                    fullname : req.body.fullname,
                    country:req.body.country,
                    Category:req.body.Category,
                    email:req.body.email,
                    password:hashedPass,
                    image:req.file.path                  

                });



               const transporter = nodemailer.createTransport({
                service: 'gmail',secure:false,    requireTLS: true,
    
                auth: {
                  user: 'amaramootaz11@gmail.com',
                  pass: '25417290'
                }
              });

              const mailOptions = {
                from: 'amaramootaz11@gmail.com',
                to: req.body.email,
                subject: ' forsa account confirmation : ',
                text: 'please confirm your account by clicking this link below',
                html:'<a href="http://localhost:4200/#/account/loginConfirm/'+user._id+"\">"+"verify me </a>"
    
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error)
                } else {
                  console.log('Email has been sent successfully');
              
                }
    
              });

               user.save().then(result=>{
                   console.log(result)
                       res.status(201).json({message:'user Created',user})
               }).catch(err=>{
                console.log(err)
                   res.status(500).json({error:err});

               })
   
            }
        });
   }
})
.catch(err=>{
    return res.status(500).json({err});
})
}

exports.login=function(req,res)
{

userModel.findOne({email:req.body.email})
.exec()
.then(user=>{
    if(user)
    {   
        if(user.verified==false)
        {
            return res.status(401).json({message:'user not verified'});
        }
        else 
        {
            bcrypt.compare(req.body.password,user.password,(err,same)=>{
                if(err){
                    throw err;
                }
                if(same){
                 const token=jwt.sign({username:user.fullname,user_id:user._id},"Secret",{expiresIn:60*60*60})
                    return res.status(200).json({message:'login successfully',token});
                }
                else 
                {
                    return res.status(401).json({message:"password don't match"});
                }
            })
        }
    }
    else {
        return res.status(404).json({message:"email doesn't match "});
    }
})
.catch(err=>{
    return res.status(500).json({err});
})

}

exports.getProfile=function(req,res){

    userModel.findById(req.params.iduser)
    .populate('experiences','title description')
    .exec()
    .then(user=>{
        if(user)
        {
            return res.status(200).json(user);
        }
        else {
            return res.status(404).json({message:'user not found'});

        }
    })
    .catch(err=>{
        return res.status(500).json({err});
    })
}

exports.updateInfo=function(req,res){

    userModel.update({_id:req.params.iduser},{$set:{fullname:req.body.fullname,country:req.body.country,company:req.body.company}})
    .exec()
    .then(result=>{
        if(result){
            return res.status(200).json({message:'update done successfully'});
        }
        else {
            return res.status(401).json({message:'update failed'});
        }
    })
    .catch(err=>{
        return res.status(500).json({err});
    })
}

exports.updatepassword=function(req,res){

    userModel.findById(req.params.iduser)
    .exec()
    .then(user=>{
        if(user)
        {
            bcrypt.compare(req.body.oldpassword,user.password,(err,same)=>{
                if(err){
                    throw err;
                }
                else {
                    if(same){
                        bcrypt.hash(req.body.newpassword,10,(err,encrypted)=>{
                            if(err){
                                throw err;
                            }
                            
                            if(encrypted)
                            {
                                userModel.findByIdAndUpdate(req.body.userid,{$set:{password:encrypted}})
                                .exec()
                                .then(result=>{
                                    if(result){
                                        return res.status(200).json({message:'update password done'})

                                    }
                                    else {
                                        return res.status(400).json({message:'update failed'});
                                    }
                                })
                                .catch(err=>{
                                    return res.status(500).json({err});
                                })
                            }
                            else {
                                return res.status(400).json({message:'update failed'})
                            }
                            

                        })
                        .catch(err=>{
                            return res.status(500).json({err});

                        })
                    }
                    else 
                    {
                        return res.status(400).json({message:"password doesn't match"});
                    }
                }
            })
        }
        else {
            return res.status(404).json({message:"user not found"});

        }


    })


    .catch(err=>{
        return res.status(500).json({err});

    })
}


exports.updateImage=function(req,res){
    userModel.findById(req.params.iduser)
    .exec()
    .then(user=>{
        if(user)
        {
            userModel.findByIdAndUpdate(req.params.iduser,{$set:{image:req.file.path}})
            .exec()
            .then(result=>{
                if(result){
                    path="C:\\Users\\pc\\Desktop\\FORSA\\"+user.image;
                    fs.unlink(path,err=>{
                        if(err){
                            throw err;
                        }
                    })
                    return res.send({message:"update image done"})
                }

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



exports.updateCover=function(req,res){
    userModel.findById(req.params.iduser)
    .exec()
    .then(user=>{
        if(user)
        {   
            userModel.findByIdAndUpdate(req.params.iduser,{$set:{cover:req.file.path}})
            .exec()
            .then(result=>{
                if(result){
                    if(user.cover!==""){
                    path="C:\\Users\\pc\\Desktop\\FORSA\\"+user.cover;
                    fs.unlink(path,err=>{
                        if(err){
                            throw err;
                        }
                    })
                    return res.status(200).json({message:'cover update done with delete image from uploads '});

                     }
                     return res.status(200).json({message:'cover update done'});

            }

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



exports.updateEmail=function(req,res){
    userModel.findByIdAndUpdate(req.params.iduser,{$set:{email:req.body.email}})
    .exec()
    .then(result=>{
        if(result){
    const transporter = nodemailer.createTransport({
                service: 'gmail',secure:false,    requireTLS: true,
    
                auth: {
                  user: 'amaramootaz11@gmail.com',
                  pass: '25417290'
                }
              });
              const mailOptions = {
                from: 'amaramootaz11@gmail.com',
                to: req.body.email,
                subject: ' forsa account confirmation : ',
                text: 'please confirm your account by clicking this link below',
                html:'<a href="http://localhost:4200/#/account/loginConfirm/'+req.params.iduser+"\">"+"verify me </a>"
    
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error)
                } else {

                  console.log('Email has been sent successfully');
                  return res.status(200).json({message:'update done successfully'});


                }
    
              });
        }
        else {
            return res.status(401).json({message:'update failed'});
        }
    })
    .catch(err=>{
        return res.status(500).json({err});
    })
}

exports.DesactivateAccount=function(req,res){

userModel.findByIdAndUpdate(req.params.iduser,{$set:{disactivated:true}},(err,result)=>{
    if(err)
    {
        return res.status(500).json({err});
    }
    if(result){
        return res.status(200).json({message:"update disactivation done"});
    }
    else {
        return res.status(400).json({message:"update failed"});
    }
})
}
exports.updateStatus=function(req,res){

   userModel.findById(req.params.iduser)
   .exec()
   .then(user=>{
       if(user.status===1){
           user.status=0;
       }
       else {
           user.status=1;
       }
    user.save((err,userupdated)=>{
        if(err){
            return res.status(500).json(err);
                }
        if(userupdated){
            return res.status(200).json({message:"update done"});
        }
        else {
            return res.status(400).json({message:"update failed"});
        }
    })
   })
   .catch(err=>{
    return res.status(500).json(err);
 })
}

