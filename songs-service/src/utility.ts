import { neon } from "@neondatabase/serverless"
import type { NextFunction, Request, RequestHandler, Response } from "express"
import dotenv from "dotenv"
import redis from 'redis'
dotenv.config()
export const asyncHandler=(handler:RequestHandler):RequestHandler=>
{
    return async(req:Request,res:Response,next:NextFunction)=>
    {
      try {
        await handler(req,res,next)
      } catch (error:any) {
       return res.status(501).json({
         message:error.message
       })
      }  
    } 
}
export const sql=neon(process.env.DB_URL as string)
export const redisClient=redis.createClient({
      password:process.env.REDIS_PASSWORD as string, 
    socket:{
        host:process.env.REDIS_HOST as string,
        port:11241 ,
      family:6
        
    } 
})
