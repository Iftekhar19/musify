import type { Response,Request, NextFunction } from 'express';
import axios from 'axios'
import dotenv from "dotenv"
import multer from "multer"
dotenv.config()
interface Isuer{
    _id:string,
       name:string,
    email:string,
    phone:string,
    password:string,
    role:string,
    playlist:string[] 
}

interface AuthenticatedRequest extends Request{
    user?:Isuer|null
}

export const isAth=async(req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void>=>
{
  try {
   const token=req.headers.token as string;
  const Cookiestoken: string | undefined = req.cookies?.token||token;
  // console.log(Cookiestoken)
   if(!Cookiestoken) throw new Error("token not found")
   const {data}=await axios.get(`http://localhost:8000/api/v1/users/profile`,{
   headers:{
    token:token||Cookiestoken
   }
}) 
  req.user=data.user
  next();
} catch (error) {
  console.log(error)
    res.status(403).json({
      message:"Unauthenticated user",
      success:false 
    })
    return;
  }
}
// multer setup
const storage=multer.memoryStorage()

export const uploadFile=multer({storage}).single("file")
 