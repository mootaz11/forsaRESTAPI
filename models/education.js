const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    school:{type:String,required:true},
    degree:{type:String,required:true},
    duration:{type:String,required:true},
    description:{type:String,required:true},
    user : {type:mongoose.Schema.Types.ObjectId,ref:'user'}
});

module.exports=mongoose.model('education',EducationSchema);
