import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type Iuser } from "./model.js";
export interface AuthenticatedRequest extends Request{
     user?:Iuser|null
}
export const middleware=async(req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<void>=>{
try {
   // console.log(req.cookies.token)
   const token=req.headers.token as string||req.cookies.token as string
   // console.log(req.cookies.token)
   if(!token)
   {
    throw new Error("Token not found")
   }

   const decodedToken= jwt.verify(token,process.env.JWT_SECRETKEY as string) as JwtPayload
   if(!decodedToken || !decodedToken._id)
   {
    throw new Error("Token not found")
   }
   const user=await User.findById(decodedToken._id).select(["-password"])
   if(!user){
    res.status(403).json({
        message:"User not found",
        success:false
    })
    return;
   }
   req.user=user;
   next();

} catch (error) {
   // console.log(error?.messa)
    res.status(403).json({
      message:"Please login",
      success:false
   })
   return 
}
}