const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    fullname:{type:String,required:true},
    country:{type:String,required:true},
    Category:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    image:{type:String},
    cover:{type:String,default:""},
    status:{type:Number,default:1},
    title:String,
    verified:{type:Boolean,default:false},
    disactivated:{type:Boolean,default:false},
    experiences:[{type:mongoose.Schema.Types.ObjectId,ref:'experience'}],
    educations:[{type:mongoose.Schema.Types.ObjectId,ref:'education'}],
    jobs:[{type:mongoose.Schema.Types.ObjectId,ref:'job'}],
    friendlist:[{name:String,iduser:mongoose.Schema.Types.ObjectId,imageFriend:String}],
    SentRequests:[{name:String,iduser:mongoose.Schema.Types.ObjectId,imageFriend:String}],
    ReceivedRequests:[{name:String,iduser:mongoose.Schema.Types.ObjectId,imageFriend:String}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'comment'}],
    skills:[{type:mongoose.Schema.Types.ObjectId,ref:'skill'}],
    projects:[{type:mongoose.Schema.Types.ObjectId,ref:'project'}],


});


module.exports=mongoose.model('user',UserSchema);
