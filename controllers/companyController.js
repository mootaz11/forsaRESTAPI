const companyModel = require("../models/company");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const fs = require("fs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.showRequests=function(req,res){
    companyModel.findById(req.params.id)
    .exec()
    .then(company=>{
        if(company)
        {   
            const requests= company.ReceivedRequests;
            return res.status(200).json({message:'requests found',requests});
        }
        else {
            return res.status(404).json({message:'company not found'});
        }
    })
    .catch(err=>{
        return res.status(500).json(err);
    })
    
    }



exports.searchFriend=function(req,res){
    companyModel.find({"fullname": /req.body.fullname/})
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
    

exports.getAllcompanies=function(req,res){
companyModel.find()
.exec()
.then(companies=>{

    if(companies.length>0){
        return res.status(200).json({companies});
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
companyModel.findOne({email:req.body.email})
.exec()
.then(company=>{
    if(company)
    {
        res.status(409).json({message:'mail exists'});
    }
    else {
        bcrypt.hash(req.body.password,10, async (err,hashedPass)=>
        {
            if (err){
                return res.status(500).json({error:err})
            }
            else {
                   const company = new companyModel({
                    _id:new mongoose.Types.ObjectId(),
                    CompanyName : req.body.CompanyName,
                    country:req.body.country,
                    email:req.body.email,
                    password:hashedPass,
                    image:"",
                    Location:"",
                    totalEmployees:0,
                    foundationDate:""
            });



               const transporter = nodemailer.createTransport({
                service: 'gmail',secure:false,    requireTLS: true,
    
                auth: {
                  company: 'amaramootaz11@gmail.com',
                  pass: '25417290'
                }
              });

              const mailOptions = {
                from: 'amaramootaz11@gmail.com',
                to: req.body.email,
                subject: ' forsa account confirmation : ',
                text: 'please confirm your account by clicking this link below',
                html:'<a href="http://localhost:4200/#/account/loginConfirm/'+company._id+"\">"+"verify me </a>"
    
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error)
                } else {
                  console.log('Email has been sent successfully');
              
                }
    
              });

               company.save().then(result=>{
                   console.log(result)
                       res.status(201).json({message:'company Created',company})
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



exports.updateTotalEmployees=function(req,res){
    companyModel.findByIdAndUpdate(req.params.companyid,{$set:{totalEmployees:req.body.totalEmployees}})
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
exports.updateLocation=function(req,res){
    companyModel.findByIdAndUpdate(req.params.companyid,{$set:{Location:req.body.Location}})
    .exec()
    .then(result=>{
        if(result){
            return res.status(200).json({message:' location updated',result});
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
    
    companyModel.findByIdAndUpdate(req.params.companyid,{$set:{foundationDate:req.body.foundationDate}})
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
exports.login=function(req,res)
{

companyModel.findOne({email:req.body.email})
.exec()
.then(company=>{
    if(company
)
    {   
        if(company.verified==false)
        {
            return res.status(401).json({message:'company not verified'});
        }
        else 
        {
            bcrypt.compare(req.body.password,company.password,(err,same)=>{
                if(err){
                    throw err;
                }
                if(same){
                 const token=jwt.sign({companyname:company.fullname,company_id:company._id},"Secret",{expiresIn:60*60*60})
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

    companyModel.findById(req.params.idcompany)
    .populate('experiences','title description')
    .exec()
    .then(company=>{
        if(company)
        {
            return res.status(200).json(company);
        }
        else {
            return res.status(404).json({message:'company not found'});

        }
    })
    .catch(err=>{
        return res.status(500).json({err});
    })
}

exports.updateInfo=function(req,res){

    companyModel.update({_id:req.params.idcompany},{$set:{CompanyName:req.body.CompanyName,country:req.body.country}})
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

    companyModel.findById(req.params.idcompany)
    .exec()
    .then(company=>{
        if(company)
        {
            bcrypt.compare(req.body.oldpassword,company.password,(err,same)=>{
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
                                companyModel.findByIdAndUpdate(req.body.companyid,{$set:{password:encrypted}})
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
            return res.status(404).json({message:"company not found"});}
            })
    .catch(err=>{
        return res.status(500).json({err});

    })
}


exports.updateImage=function(req,res){
    companyModel.findById(req.params.idcompany)
    .exec()
    .then(company=>{
        if(company)
        {
            companyModel.findByIdAndUpdate(req.params.idcompany,{$set:{image:req.file.path}})
            .exec()
            .then(result=>{
                if(result){
                    path="C:\\users\\pc\\Desktop\\FORSA\\"+company.image;
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
    companyModel.findById(req.params.idcompany)
    .exec()
    .then(company=>{
        if(company)
        {   
            companyModel.findByIdAndUpdate(req.params.idcompany,{$set:{cover:req.file.path}})
            .exec()
            .then(result=>{
                if(result){
                    if(company.cover!==""){
                    path="C:\\userss\\pc\\Desktop\\FORSA\\"+company.cover;
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
    companyModel.findByIdAndUpdate(req.params.idcompany,{$set:{email:req.body.email}})
    .exec()
    .then(result=>{
        if(result){
    const transporter = nodemailer.createTransport({
                service: 'gmail',secure:false,    requireTLS: true,
    
                auth: {
                  company: 'amaramootaz11@gmail.com',
                  pass: '25417290'
                }
              });
              const mailOptions = {
                from: 'amaramootaz11@gmail.com',
                to: req.body.email,
                subject: ' forsa account confirmation : ',
                text: 'please confirm your account by clicking this link below',
                html:'<a href="http://localhost:4200/#/account/loginConfirm/'+req.params.idcompany+"\">"+"verify me </a>"
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

companyModel.findByIdAndUpdate(req.params.idcompany
,{$set:{disactivated:true}},(err,result)=>{
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
companyModel.findById(req.params.idcompany)
   .exec()
   .then(company=>{
       if(company.status===1){
           company.status=0;
       }
       else {
           company.status=1;
       }
    company.save((err,companyupdated)=>{
        if(err){
            return res.status(500).json(err);
                }
        if(companyupdated){
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

