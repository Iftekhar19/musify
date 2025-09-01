import express from "express"
import dotenv from "dotenv"
import { dbConnect } from "./utils/dbconnect.js";
import { route } from "./route.js";
import cors from 'cors'
dotenv.config()
const app =express();
app.use(cors())
const PORT=process.env.PORT||8000
app.use(express.json())
app.use("/api/v1/users",route)
app.listen(8000,()=>{console.log(`Server is running on port: ${PORT}`) 
dbConnect()
}) 