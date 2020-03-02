const mongoose = require("mongoose");


const CompanySchema = new mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    CompanyName:{type:String,required:true},
    country:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    image:{type:String},
    cover:{type:String},
    verfied:{type:Boolean,default:false}
});

module.exports=mongoose.model('company',CompanySchema);
