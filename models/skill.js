const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true}
    
});

module.exports=mongoose.model('skill',SkillSchema);

