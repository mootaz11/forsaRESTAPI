const userModel = require("../models/user");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const fs = require("fs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.logout= function(req,res){
userModel.findByIdAndUpdate(req.params.iduser,{$set:{status:0}},(err,result)=>{
    if(err){
        throw new Error("update failed");
    }
    if(result){
        return res.status(200);
    }
    else {
        return res.status(401);
    }
})
}


exports.getOtherProfiles= async function(req,res){
    const users = await userModel.find( { _id:{$nin:[req.params.iduser]}} );
    var other_profiles=[]
    users.forEach(user=>{
        var index=-1;
        for(i=0;i<user.friendlist.length;i++){
            if(user.friendlist[i].iduser==req.params.iduser){
                index=i;
            }
        }
        if(index==-1)
            {
                other_profiles.push(user);
                index=-1;
            }
    });
    return res.send(other_profiles);

}


exports.getTopprofiles=async function(req,res)
{

const users = await userModel.find({_id:{$nin:[req.params.iduser]}});
const topProfiles = [];

var top = req.params.top;

for(var i =0;i<top ; i++)
{
    var max = users[0];
    for(var j=1;j<users.length;j++)
    {
        if(max.friendlist.length<=users[j].friendlist.length)
        {
            max = users[j];
        }
    }
    users.splice(users.indexOf(max),1);
    topProfiles.push(max);
}
return res.send(topProfiles);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

exports.getSuggestions= async function(req,res){
    const user = await userModel.findById(req.params.iduser);
    let suggestions=[]
    for(i=0;i<user.friendlist.length;i++){
        const _user=await userModel.findById(user.friendlist[i].iduser)
        for(j=0;j<_user.friendlist.length;j++){
            const __user=await userModel.findById(_user.friendlist[j].iduser)
            const index=user.friendlist.findIndex(exist => exist.iduser == __user._id)
            if(index==-1 && __user._id!=req.params.iduser){
            suggestions.push(__user)}
        }
    }
    suggestions=shuffle(suggestions)
    if(suggestions.length>req.params.Nbsug){
        suggestions=suggestions.splice(suggestions.length-req.params.Nbsug,suggestions.length)}
    return res.send(suggestions)
}

exports.getProfileFeeds=function(req,res){
    const tabfeeds=[];
    userModel.findById(req.params.iduser)
    .populate('jobs')
    .populate('projects')
    .exec()
    .then(result=>{
        if(result){
                result.jobs.forEach(element=>{
                tabfeeds.push({job:element,date:element.createdAt});
            })
            result.projects.forEach(element=>{
                tabfeeds.push({project:element,date:element.createdAt});
            });
            tabfeeds.sort((a,b)=>{
            return  -(a.date-b.date)
            })

            return res.send(tabfeeds);
        }
        else {
            return res.send({message:'no feeds'});
        }                    
    })
    .catch(err=>{console.log(err)})
}




exports.getOnlinefriends= function(req,res)
{
    const onlineFriends=[];
    userModel.findById(req.params.iduser, async (err,user)=>{
        if(err)
        {
            throw new Error("error");
        }
        if(user){
                for(var i = 0 ; i< user.friendlist.length;i++)
                {
                    const friend= await userModel.findById(user.friendlist[i].iduser);
                    if(friend.status===1)
                    {
                        onlineFriends.push(user.friendlist[i]);
                    }
                }
            return res.send(onlineFriends);
        }
        else {
            return res.status(404).json({message:'user not found'});
        }
    })
}




exports.getFriendList=function(req,res){
    userModel.findById(req.params.iduser)
    .then(async user=>{
        
        if(user){
            const  friendList=[];
      for(var i =0 ;i<user.friendlist.length;i++)
        {
            
        const result  = await userModel.findById(user.friendlist[i].iduser) 
        friendList.push(result);

        }
            return res.send(friendList);
        }
        else {
            res.status(404).json({message:'user not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
}

exports.getLatestFeeds=function(req,res)
{
 tabfeeds=[];
 userModel.findById(req.params.iduser)
.exec()
.then(async user=>{
    result=await userModel.findById(req.params.iduser)
    .populate('jobs')
    .populate('projects')
    .exec();
    
        if(result){
                result.jobs.forEach(element=>{
                tabfeeds.push({job:element,userName:result.fullname,userImage:result.image,userid:result._id,userLocation:result.location,userJob:result.title,date:element.createdAt});
            });
                result.projects.forEach(element=>{
                    tabfeeds.push({project:element,userName:result.fullname,userImage:result.image,userid:result._id,userLocation:result.location,userJob:result.title,date:element.createdAt});
            });
           
        }
    if(user.friendlist.length==0){
        return res.send(tabfeeds)
    } 
    for(i=0;i<user.friendlist.length;i++){
                result= await userModel.findById(user.friendlist[i].iduser)
                .populate('jobs')
                .populate('projects')
                .exec()
                ;
                    if(result){
                        for(j=0;j<result.jobs.length;j++){
                        tabfeeds.push({job:result.jobs[j],userName:result.fullname,userImage:result.image,userid:result._id,userLocation:result.location,userJob:result.title,date:result.jobs[j].createdAt})
                        }
                       for(j=0;j<result.projects.length;j++){
                        tabfeeds.push({project:result.projects[j],userName:result.fullname,userImage:result.image,userid:result._id,userLocation:result.location,userJob:result.title,date:result.projects[j].createdAt})
                        }
                        tabfeeds.sort((a,b)=>{
                        return  -(a.date-b.date)
                        })
                       }
     } return res.send(tabfeeds)
 }) 
.catch(err=>{return res.status(500).json({err})})

}

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

    exports.updateTotalEmployees=function(req,res){
        userModel.findByIdAndUpdate(req.params.iduser,{$set:{totalEmployees:req.body.totalEmployees}})
        .exec()
        .then(result=>{
            if(result){
                return res.status(200).json({message:'number of employees updated',result});
        }
        else {
            return res.status(400).json({message:'update failed'});
        }
    }
    )
        .catch(err=>{
            return res.status(500).json(err);
        })
    }
    exports.updateEstablishedSince=function(req,res){
    
        userModel.findByIdAndUpdate(req.params.iduser,{$set:{foundationDate:req.body.foundationDate}})
        .exec()
        .then(result=>{
            if(result){
                return res.status(200).json({message:' foundation Date updated',result});
        }
        else {
            return res.status(400).json({message:'update failed'});
        }
    }
    )
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

    if(users.length>=0){
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

exports.updateOverview=function(req,res){
    console.log(req.params.iduser)
    userModel.findByIdAndUpdate(req.params.iduser,{$set:{overview:req.body.overview}},(err,result)=>{
        if(err){
            return Error('error has been occured');
        }
        if(result){
            return res.status(200).json({message:'overview updated'})
        }
        else 
        {
            return res.status(400).json({message:'update failed'});
        }

    });
}
exports.updateCountry=function(req,res){
    console.log(req.params.iduser)
    userModel.findByIdAndUpdate(req.params.iduser,{$set:{country:req.body.country}},(err,result)=>{
        if(err){
            return Error('error has been occured');
        }
        if(result){
            return res.status(200).json({message:'country updated'})
        }
        else 
        {
            return res.status(400).json({message:'update failed'});
        }

    });
}
exports.updateLocation=function(req,res){
    
    userModel.findByIdAndUpdate(req.params.iduser,{$set:{location:req.body.location}},(err,result)=>{
        if(err){
            return Error('error has been occured');
        }
        if(result){
            console.log("ok")
            return res.status(200).json({message:'location updated'})
        }
        else 
        {
            return res.status(400).json({message:'update failed'});
        }

    });
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
                    _id:new mongoose.Types.ObjectId(),
                    fullname : req.body.fullname,
                    country:req.body.country,
                    email:req.body.email,
                    category:req.body.category,
                    password:hashedPass,
                    image:"uploads\\1584895914321user-pro-img.png",
                    title:" ",
                    cover:"uploads\\1584439090144about.png"                 
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


exports.updateTitle=function(req,res){
    console.log(req.params.iduser)
    console.log(req.body.title)
    userModel.findByIdAndUpdate(req.params.iduser,{$set:{title:req.body.title}},(err,result)=>{
        if(err){
            return Error('error has been occured');
        }
        if(result){
            return res.status(200).json({message:'title updated'})
        }
        else 
        {
            return res.status(400).json({message:'update failed'});
        }

    });
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
                    user.status=1;
                    user.save().then(result=>{if(result){
                        const token=jwt.sign({username:user.fullname,user_id:user._id},"Secret",{expiresIn:60*60*60})
                        return res.status(200).json({message:'login successfully',token});
                     }});
                    
                
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
            return res.status(200).json({message:'update done successfully',result});
        }
        else {
            return res.status(401).json({message:'update failed'});
        }
    })
    .catch(err=>{
        return res.status(500).json({err});
    })
}
exports.loginGoogle=function(req,res){}

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
                    path=user.image;
                    /*fs.unlink(path,err=>{
                        if(err){
                            throw err;
                        }
                    })*/
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
                    path=user.cover;
                    /*fs.unlink(path,err=>{
                        if(err){
                            throw err;
                        }
                    })*/
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

