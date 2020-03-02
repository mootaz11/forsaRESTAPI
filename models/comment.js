const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    time:{type:Date,required:true},
    content:{type:String,required:true}
   
});

module.exports=mongoose.model('comment',commentSchema);

