import express from "express"
import { getAllAlbums, getAllSongsOfAlbum, getPlayList, getSongs, song } from "./controller.js";
const router=express.Router();
router.get("/songs",getSongs)
router.get("/albums",getAllAlbums)
router.get("/album/:id/songs",getAllSongsOfAlbum)
router.get("/song/:id",song)
router.post("/playlist",getPlayList)
export default router