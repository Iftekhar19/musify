import type { Response } from "express";
import asyncHandler from "./asyncHandler.js"
import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
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
  const hashedPassword=await bcrypt.hash(password,Number(process.env.SALT_ROUND as string)||10)
  if(user)
  {
    user.name=name,
    user.phone=phone,
    user.password=hashedPassword,
    user.role=role||"user"
    await user.save()
  }
  else{

    user=await User.create({
      name,
      email,
      phone,
      password:hashedPassword,
      role:role||"user",
      playlist:[]
    })
  }

  // const token= jwt.sign({_id:user._id},process.env.JWT_SECRETKEY as string,{
  //   expiresIn:"7d"
  // })

  return res.status(201).json({
    message:"User created successfully",
    user,
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

    const token=await jwt.sign({_id:user._id},process.env.JWT_SECRETKEY as string,{
        expiresIn:"7d"
    })
 
    return   res.cookie("token",token,{
      httpOnly:true, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // sameSite:"none",
      // secure:false
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
    return res.status(200).json({
        message:"User information",
        success:true,
        user
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