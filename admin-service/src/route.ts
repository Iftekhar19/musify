import express from "express"
import { isAth, uploadFile } from "./middleware.js";
import { addAlbum, addSong, addThumbnail, deleteAlbum, deleteSong } from "./controller.js";
const router=express.Router();
router.post("/upload/album",isAth,uploadFile,addAlbum)
router.post("/upload/song",isAth,uploadFile,addSong)
router.patch("/upload/thumbnail/:songId",isAth,uploadFile,addThumbnail)
router.delete("/delete/album/:albumId",isAth,deleteAlbum)
router.delete("/delete/song/:songId",isAth,deleteSong)
export default router 