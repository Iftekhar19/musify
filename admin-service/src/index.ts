import express from "express"
import dotenv from "dotenv"
import { initDB, redisClient } from "./utility.js";
import router from "./route.js";
import cloudinary from "cloudinary"
import cors from 'cors'

const app =express();
app.use(cors())
dotenv.config() 
app.use(express.json())
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key:process.env.CLOUDINARY_API_KEY as string,
    api_secret:process.env.CLOUDINARY_SECRET_KEY as string
   
})
const PORT=process.env.PORT||8001 
app.use("/api/v1/admin",router)
redisClient 
  .connect()
  .then(() => {
    console.log("Redis connected"); 
  })
  .catch((err) => console.log("Failed to connect redis--->", err));
initDB().then(()=>
{ 


    app.listen(PORT,()=>
    {
        console.log(`Admin service is running on ${PORT}`)
    })
}).catch(err=> 
{
   console.log(err) 
   process.exit() 
} 
)
