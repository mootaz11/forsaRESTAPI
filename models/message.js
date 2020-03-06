const mongoose=require("mongoose");
messageSchema=new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,    
text :String,
sentBy:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
sentTo:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
date:Date
});
module.exports=mongoose.model('message',messageSchema);
