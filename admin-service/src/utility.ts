import type { Request,Response,RequestHandler,NextFunction } from "express"
import { neon } from "@neondatabase/serverless";
import dotenv from 'dotenv'
import path from "path"
import redis from 'redis'
import DataURIParser from "datauri/parser.js";
dotenv.config()
export const sql=neon(process.env.DB_URL as string)

export const initDB=async()=>
{
try {
      await sql`CREATE TABLE IF NOT EXISTS albums(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT  NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`  
      await sql`CREATE TABLE IF NOT EXISTS songs(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT  NULL,
        description VARCHAR(255) NOT NULL, 
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )` 
      console.log('DATABASE INITILIAZED') 
} catch (error) {
    console.log(error)
   console.log('Error INITDB') 
}
}
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
export const getBuffer=(file:any)=>
{
    const parser=new DataURIParser()
  const extName=path.extname(file.originalname).toString()  
   return parser.format(extName,file.buffer)
}
export const redisClient=redis.createClient({
      password:process.env.REDIS_PASSWORD as string, 
    socket:{
        host:process.env.REDIS_HOST as string, 
        port:11241 ,
        family:6
        
    } 
})
 
