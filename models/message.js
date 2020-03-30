const mongoose=require("mongoose");
messageSchema=new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,    
text :String,
sender:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
receiver:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
date:String
});
module.exports=mongoose.model('message',messageSchema);
