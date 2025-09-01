import express from "express"
import { addSongToPlaylist, loginUser, registerUser, removeSongFromPlaylist, userProfile } from "./controller.js";
import { middleware } from "./middleware.js";
const route=express.Router();
route.post("/signup",registerUser)
route.post("/signin",loginUser)
route.get("/profile",middleware,userProfile)
route.post("/playlist/add",middleware,addSongToPlaylist)
route.delete("/playlist/remove",middleware,removeSongFromPlaylist) 
export {route}