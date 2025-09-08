import type { Response,Request } from "express";
import asyncHandler from "./asyncHandler.js"
import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { publishMessage } from "./utils/publisher.js";
export const registerUser=asyncHandler(async(req,res)=>
{
  const {name,email,password,phone,role}=req.body ;
  let user= await User.findOne({email})
  if(user && user.isVerified)
  {
    return res.status(400).json({
        message:"User already exist",
        success:false
    })
  }
  const saltRounds = Number(process.env.SALT_ROUND) || 10;
  let hashedToken;
  const token =jwt.sign({email},process.env.JWT_SECRETKEY as string,{
        expiresIn:"7d"
    })
  const hashedPassword=await bcrypt.hash(password.toString(),saltRounds)
  if(user)
  {
     hashedToken=await bcrypt.hash(token,saltRounds)
    user.name=name
    user.phone=phone
    user.password=hashedPassword
    user.role="user"
    user.verifyAccountToken=hashedToken;
    user.VerifyAccountTokenExpiry=new Date(Date.now()+3600000)
    await user.save()
  }
  else{
    
    user=await User.create({
      name,
      email,
      phone,
      password:hashedPassword,
      role:"user",
      playlist:[]
    })
     hashedToken=await bcrypt.hash(token,saltRounds )
    user.verifyAccountToken=hashedToken;
    user.VerifyAccountTokenExpiry=new Date(Date.now()+3600000);
    await user.save();

  }
  // const host = req?.headers?.host || req?.headers?.['x-forwarded-host'];
  // const protocol = req?.headers?.['x-forwarded-proto'] || 'http';
  // const baseUrl = `${protocol}://${host}`;
  const link=`${process.env.DOMAIN}/verify-account?token=${token}&userId=${user._id}`
  
 
  await publishMessage({email,link,emailType:"VERIFY_ACCOUNT"}).catch(err=>{
    console.log(err)
  })
  return res.status(201).json({
    message:`An account verification link has been sent to ${email}`,
    // user,
    // token
  })
})

export const loginUser=asyncHandler(async(req,res)=>
{
  const {email,password}=req.body
  const user=await User.findOne({
    email
  })
  if(!user) 
    {
      return res.status(401).json({
        message:"User not exists",
        success:false
      })  
    }
    if(!user.isVerified){
            return res.status(401).json({
        message:"Your account verification is pending",
        success:false
      })  
    }
    
    const isCorrectPassword=await bcrypt.compare(password,user.password)
    if(!isCorrectPassword)
    {
        return res.status(401).json({
        message:"Invalid credentials",
        success:false
      }) 
    }

    const token= jwt.sign({_id:user._id},process.env.JWT_SECRETKEY as string,{
        expiresIn:"7d"
    })
 
    return   res.cookie("token",token,{
      httpOnly:true, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // sameSite:"none",
      // domain:"localhost",
      secure:false
    }).status(201).json({
        message:"User Logged in successfully",
        success:true,
        user,
        token
      }) 
})
export const userProfile=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>
{
    const user=req.user;
    const token=req.token
    return res.status(200).json({
        message:"User information",
        success:true,
        user,
        token:token
    })
})
export const addSongToPlaylist=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>
{
  const {songId}=req.body;
  if(!songId)
  {
    return res.status(400).json({
      message:"id not provided",
      success:false
    })
  }
  const id=req.user?._id;
  await User.findByIdAndUpdate(id,{
   $push :{
    playlist:songId
   }
  })
  return res.status(201).json({
    message:"Added to playlist",
    success:true
  })
})
export const removeSongFromPlaylist=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>
{
  const {id:songId}=req.params;
  if(!songId)
  {
    return res.status(400).json({
      message:"id not provided",
      success:false
    })
  }
  const id=req.user?._id;
  await User.findByIdAndUpdate(id,{
   $pull :{
    playlist:songId
   }
  })
  return res.status(201).json({
    message:"Remove from playlist",
    success:true
  })
})
export const verifyAccount=asyncHandler(async(req:Request,res:Response)=>
{
   const {token,userId}=req.query
  
   if(!token || !userId)
   {
    return res.status(403).json({
      message:"Invalid link",
      success:false
    })
   }
   const user=await User.findOne({
    _id:userId,
    VerifyAccountTokenExpiry:{$gt:Date.now()}
   })
   if(!user)
   {
     return res.status(403).json({
      message:"Invalid link or link has been expired",
      success:false
    }) 
   }
   const isCorrect=await bcrypt.compare(token as string, user.verifyAccountToken as string)
   if(!isCorrect)
   {

     return res.status(403).json({
      message:"Invalid link",
      success:false
    })
   }
   user.isVerified=true;
   user.verifyAccountToken="";
   user.VerifyAccountTokenExpiry=new Date();
   await user.save();
    return res.status(200).json({
      message:"Account verified successfully",
      success:true
    })
})
export const verifyPasswordResetLink=asyncHandler(async(req:Request,res:Response)=>
{
   const {token,userId}=req.query
   if(!token || !userId)
   {
    return res.status(403).json({
      message:"Invalid link",
      success:false
    })
   }
   const user=await User.findOne({
    _id:userId,
    verifyPasswordTokenExpiry:{$gt:Date.now()}
   })
   if(!user)
   {
     return res.status(403).json({
      message:"Invalid link or link has been expired",
      success:false
    })
   }
   const isCorrect=await bcrypt.compare(token as string,user.verifypasswordToken)
   if(!isCorrect)
   {
     return res.status(403).json({
      message:"Invalid link",
      success:false
    })
   }
   
   user.verifypasswordToken="";
   user.verifyPasswordTokenExpiry=new Date();
   await user.save()
    return res.status(200).json({
      message:"Link has been successfully validated",
      success:true
    })
})
export const passwordReset=asyncHandler(async(req:Request,res:Response)=>
{
  const {password,userId}=req.body
  if(!password || !userId)
  {
    return res.status(403).json({
      message:"insufficient data provided",
      success:false
    })

  }
  const saltRound=await bcrypt.genSalt(Number(process.env.SALT_ROUND)||10)
  const hashedPassword=await bcrypt.hash(password,saltRound)
  const user=await User.findByIdAndUpdate(userId,{
    password:hashedPassword
  })
  if(!user)
  {
     return res.status(400).json({
      message:"Something went wrong",
      success:false
    })
  }
  return res.status(200).json({
    message:"Password reset successfully done",
    success:true
  })

})
export const passwordResetLink=asyncHandler(async(req:Request,res:Response)=>
{
  const {email}=req.body;
  const user=await User.findOne({email})
  if(!user)
  {
    return res.status(404).json({
      message:"User not exist",
      success:false
    })
  }
  const saltRounds = Number(process.env.SALT_ROUND) || 10;
  const token=await jwt.sign({email},process.env.JWT_SECRETKEY as string,{
    expiresIn:"1h"
  })
  const hashedToken=await bcrypt.hash(token,saltRounds)
  //  const host = req?.headers?.host || req?.headers?.['x-forwarded-host'];
  // const protocol = req?.headers?.['x-forwarded-proto'] || 'http';
  // const baseUrl = `${protocol}://${host}`;
  const link=`${process.env.DOMAIN}/reset-password?token=${token}&userId=${user._id}`
  user.verifypasswordToken=hashedToken;
  user.verifyPasswordTokenExpiry=new Date(Date.now()+3600000)
  await user.save()
  
  publishMessage({email,link,emailType:"RESET_PASSWORD"}).catch(err=>
  {
    console.log(err.message) 
  }
  )

  return res.status(201).json({
    message:`A password reset link has been sent to your ${email}`,
    success:true
  })

})
export const logoutUser=asyncHandler(async(req:Request,res:Response)=>
{
  return res.clearCookie('token',{
    secure:true,
    httpOnly: true,
  }).status(200).json({
    message:"logged out successfully",
    success:false
  })
})
