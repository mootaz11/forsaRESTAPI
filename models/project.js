const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true},
    category:{type:String,required:true},
    skills:{type:String,required:true},
    price:{type:Number,required:true},
    toprice:{type:Number,required:true},
    description:{type:String}
   
});

module.exports=mongoose.model('project',ProjectSchema);


