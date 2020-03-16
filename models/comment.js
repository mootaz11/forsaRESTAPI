const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    time:{type:Date,required:true},
    content:{type:String,required:true},
   
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    project:{type:mongoose.Schema.Types.ObjectId,ref:'project'},
    job:{type:mongoose.Schema.Types.ObjectId,ref:'job'},
    company:{type:mongoose.Schema.Types.ObjectId,ref:'company'}

});

module.exports=mongoose.model('comment',commentSchema);

