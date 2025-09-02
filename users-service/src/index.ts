import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./utils/dbconnect.js";
import { route } from "./route.js"; // 👈 make sure you exported as "route"
import cors from "cors";
import cookieParser from 'cookie-parser'

dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 8000;
 app.use(cookieParser());
app.use(express.json());

// Routes

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,               // allow cookies 
  }) 
);

app.use("/api/v1/users", route);
// Start server AFTER DB connect
const startServer = async () => {
  try {
    await dbConnect(); // ✅ wait for DB connection
    app.listen(PORT, () => {
      console.log(`🚀 User service is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB", error);
    process.exit(1);
  }
};

startServer();
