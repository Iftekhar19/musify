import express from "express"
import { getAllAlbums, getAllSongsOfAlbum, getCategories, getPlayList, getSongs, song } from "./controller.js";
const router=express.Router();
router.get("/songs",getSongs)
router.get("/albums",getAllAlbums)
router.get("/album/:id/songs",getAllSongsOfAlbum)
router.get("/song/:id",song)
router.post("/playlist",getPlayList)
router.get("/categories",getCategories)
export default router