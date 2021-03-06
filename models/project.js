const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true},
    category:String,
    skills:{type:String,required:true},
    price:{type:Number,required:true},
    toprice:{type:Number,required:true},
    description:{type:String},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'comment'}],
    likes:[{userid:mongoose.Schema.Types.ObjectId,username:String,image:String}],
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    company:{type:mongoose.Schema.Types.ObjectId,ref:'company'},
    createdAt:Date
});

module.exports=mongoose.model('project',ProjectSchema);


