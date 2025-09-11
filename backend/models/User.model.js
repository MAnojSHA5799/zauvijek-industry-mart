const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    phone:{type:Number,required:true,min:10,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,min:6,max:10},
    gender:{type:String,required:true},
    role:{type:String,enum:['buyer','seller','admin'],default:'buyer'},
    status:{type:String,enum:['pending','approved','blocked'],default:'pending'},
    user:String
  },
  { versionKey: false, timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
