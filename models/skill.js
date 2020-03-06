const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
    
});

module.exports=mongoose.model('skill',SkillSchema);

