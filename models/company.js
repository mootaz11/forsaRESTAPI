const mongoose = require("mongoose");


const CompanySchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    CompanyName:{type:String,required:true},
    country:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    image:{type:String},
    cover:{type:String},
    verfied:{type:Boolean,default:false},
    foundationDate:String,
    totalEmployees:Number,
    Location:String,
    jobs:[{type:mongoose.Schema.Types.ObjectId,ref:'job'}],
    friendlist:[{name:String,iduser:mongoose.Schema.Types.ObjectId,imageFriend:String}],
    SentRequests:[{name:String,iduser:mongoose.Schema.Types.ObjectId,imageFriend:String}],
    ReceivedRequests:[{name:String,iduser:mongoose.Schema.Types.ObjectId,imageFriend:String}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'comment'}],
    


});

module.exports=mongoose.model('company',CompanySchema);
