import express from "express"
import { getAllAlbums, getAllSongsOfAlbum, getSongs, song } from "./controller.js";
const router=express.Router();
router.get("/songs",getSongs)
router.get("/albums",getAllAlbums)
router.get("/album/:id/songs",getAllSongsOfAlbum)
router.get("/song/:id",song)
export default router