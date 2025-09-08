import express from "express"
import { isAth, uploadFile } from "./middleware.js";
import { addAlbum, addCategory, addSong, addThumbnail, deleteAlbum, deleteCategory, deleteSong, getCategories, updateCategory } from "./controller.js";
const router=express.Router();
router.post("/upload/album",isAth,uploadFile,addAlbum)
router.post("/upload/song",isAth,uploadFile,addSong)
router.patch("/upload/thumbnail/:songId",isAth,uploadFile,addThumbnail)
router.delete("/delete/album/:albumId",isAth,deleteAlbum)
router.delete("/delete/song/:songId",isAth,deleteSong)
router.post("/add/category",isAth,uploadFile,addCategory)
router.delete("/delete/category/:id",isAth,deleteCategory)
router.patch("/update/category/:id",isAth,uploadFile,updateCategory)
router.get("/categories",isAth,getCategories)
export default router 