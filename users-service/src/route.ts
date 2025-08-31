import express from "express"
import { loginUser, registerUser, userProfile } from "./controller.js";
import { middleware } from "./middleware.js";
const route=express.Router();
route.post("/signup",registerUser)
route.post("/signin",loginUser)
route.get("/profile",middleware,userProfile)
export {route}