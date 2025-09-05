import express from "express"
import { addSongToPlaylist, loginUser, logoutUser, passwordReset, passwordResetLink, registerUser, removeSongFromPlaylist, userProfile, verifyAccount, verifyPasswordResetLink } from "./controller.js";
import { middleware } from "./middleware.js";
const route=express.Router();
route.post("/signup",registerUser)
route.post("/verify-account",verifyAccount) 
route.post("/reset-password-link",passwordResetLink) 
route.post("/verify-reset-password-link",verifyPasswordResetLink) 
route.put("/reset-password",passwordReset) 
route.post("/signin",loginUser)
route.get("/profile",middleware,userProfile) 
route.post("/playlist/add",middleware,addSongToPlaylist)   
route.delete("/playlist/remove/:id",middleware,removeSongFromPlaylist)
route.post("/logout",logoutUser) 
export {route}   














