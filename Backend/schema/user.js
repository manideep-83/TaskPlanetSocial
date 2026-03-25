const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
},{timestamps :true, timeZone: 'Asia/Kolkata'});

module.exports=mongoose.model('User',userSchema,'UserDetails');