const mongoose=require("mongoose");
notificationSchema=new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,    
message :String,
idsender:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
idreceiver:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
date:String,
idpost:String,
idrequest:String,
seen:Boolean,
});
module.exports=mongoose.model('notification',notificationSchema);
