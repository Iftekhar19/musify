import mongoose,{Document,Schema} from "mongoose";
export interface Iuser extends Document{
    name:string,
    email:string,
    phone:string,
    password:string,
    role:string,
    playlist:string[]
}

const UserSchema:Schema<Iuser>=new Schema({
name:{
    type:String,
    required:[true,"name is required"]
},
email:{
    type:String,
    required:[true,"email is required"],
    unique:[true,"Email id already exist"]
},
phone:{
    type:String,
    required:[true,"phone is required"],
    unique:[true,"Phone number already exist"]
},
password:{
    type:String,
    required:[true,"password is required"]
},
role:{
    type:String,
    required:[true,"role is required"],
    enum:["user","admin"]
},
playlist:[
    {
        type:String,
        required:true
    }
]
},{timestamps:true})
export const User=mongoose.model("User",UserSchema)