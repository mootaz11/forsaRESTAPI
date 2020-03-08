const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true},
    category:{type:String,required:true},
    skills:{type:String,required:true},
    price:{type:Number,required:true},
    time:{type:String,required:true},
    description:{type:String},
    user : {type:mongoose.Schema.Types.ObjectId,ref:'user'},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'comment'}],
    likes:[{username:String,image:String}],
    company:{type:mongoose.Schema.Types.ObjectId,ref:'company'},
    createdAt:Date

   
});

module.exports=mongoose.model('job',JobSchema);

