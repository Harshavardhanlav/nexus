const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({

    teacherID:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    fullName:{
        type:String,
        required:true
    },

    subjects:{
        type:String,
        required:true
    },

    role:{
        type:String,
        default:"teacher"
    },

    mobile:{
        type:Number,
        required:true
    },

    designation:{
        type:String,
        required:true
    },

    profilePic:{
        type:String,
        default:"",
        required:true
    } 

}, {

    timestamps:true
 
});

module.exports = mongoose.model("Teacher", teacherSchema);