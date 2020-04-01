const mongoose=require("mongoose");
messageSchema=new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,    
message :String,
idsender:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
idreceiver:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
date:String
});
module.exports=mongoose.model('message',messageSchema);
