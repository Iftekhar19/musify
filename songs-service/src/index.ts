import express from "express";
import dotenv from "dotenv";
import router from "./route.js";
import { redisClient } from "./utility.js";
import cors from 'cors'

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,               // allow cookies
  })
);
 

app.use(express.json())   
const PORT = process.env.PORT || 8002; 
dotenv.config(); 
 
redisClient  
  .connect()
  .then(() => { 
    console.log("Redis connected");
  })
  .catch((err) => console.log("Failed to connect redis--->", err));
app.use("/api/v1/", router);    
app.listen(PORT, () => {
  console.log(`Song service is running on port: ${PORT}`);
});    
     