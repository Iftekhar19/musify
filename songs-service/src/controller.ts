import type { Request, Response } from "express";
import { asyncHandler, sql } from "./utility.js";
import { redisClient } from "./utility.js";

export const getSongs = asyncHandler(async (req: Request, res: Response) => {
  let songs;
  const CACHE_EXPIRY = 1800;
  if (redisClient.isReady) {
    const cached_song = await redisClient.get("songs");
    if (cached_song) {
      console.log("cache hit");
      return res.status(200).json({
        message: "Successfully fetched",
        success: true,
        songs: JSON.parse(cached_song),
      });
    }
  }
  // songs = await sql`SELECT * FROM songs`;
  songs = await sql`SELECT 
    s.id AS id,
    s.title AS title,
    s.thumbnail AS thumbnail,
     s.audio AS audio,
  s.description AS description,
  s.album_id AS album_id,
    c.title AS category
FROM songs s
JOIN categories c ON s.category_id = c.id`;
  if (redisClient.isReady) {
    await redisClient.set("songs", JSON.stringify(songs), {
      EX: CACHE_EXPIRY,
    });
    console.log("cache miss");
  }
  return res.status(200).json({
    message: "Successfully fetched",
    success: true,
    songs,
  });
});
export const getAllAlbums = asyncHandler(
  async (req: Request, res: Response) => {
    let albums;
    const CACHE_EXPIRY = 1800;
    if (redisClient.isReady) {
      const cached_albums = await redisClient.get("albums");
      if (cached_albums) {
        console.log("cache hit");
        return res.status(200).json({
          message: "Successfully fetched",
          success: true,
          albums: JSON.parse(cached_albums),
        });
      }
    }
    // albums = await sql`SELECT * FROM albums`;
    albums = await sql`SELECT 
    al.id AS id,
    al.title AS title,
    al.thumbnail AS thumbnail,
  al.description AS description,
  al.created_at AS created_at,
    c.title AS category
FROM albums al
JOIN categories c ON al.category_id = c.id`;
    if (redisClient.isReady) {
      await redisClient.set("albums", JSON.stringify(albums), {
        EX: CACHE_EXPIRY,
      });
      console.log("cache miss");
    }
    return res.status(200).json({
      message: "Successfully fetched",
      success: true,
      albums,
    });
  }
);
export const getAllSongsOfAlbum = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const CACHE_EXPIRY = 1800;
    let album, songs;
    if (redisClient.isReady) {
      const cached_song_of_album = await redisClient.get(
        `songs_of_album_${id}`
      );
      console.log("cache hit");
      if (cached_song_of_album) {
        return res.status(200).json({
          ...JSON.parse(cached_song_of_album),
          message: "successfully fetched",
          success: true,
        });
      }
    }
    album = await sql`SELECT * FROM albums WHERE id=${id}`;
    if (album.length === 0) {
      return res.status(404).json({
        message: "No album with this id",
        succes: false,
      });
    }
    songs = await sql`SELECT * FROM songs WHERE album_id=${id}`;
    const response = {
      songs,
      album: album[0],
    };
    if (redisClient.isReady) {
      await redisClient.set(`songs_of_album_${id}`, JSON.stringify(response), {
        EX: CACHE_EXPIRY,
      });
      console.log("cache miss");
    }
    return res.status(200).json({
      ...response,
      message: "Successfully fetched",
      success: true,
    });
  }
);
export const song = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  let song;
  const CACHE_EXPIRY = 1800;
  if (redisClient.isReady) {
    const cached_song = await redisClient.get(`song_${id}`);
    if (cached_song) {
      console.log("cache hit");
      return res.status(200).json({
        success: true,
        message: "Successfully fetched",
        song: JSON.parse(cached_song)[0],
      });
    }
  }
  song = await sql`SELECT * FROM songs WHERE id=${id}`;
  if (song.length === 0) {
    return res.status(404).json({
      message: "No song available with this id",
      success: false,
    });
  }
  if (redisClient.isReady) {
    await redisClient.set(`song_${id}`, JSON.stringify(song), {
      EX: CACHE_EXPIRY,
    });
    console.log("cache miss");
  }

  return res.status(200).json({
    success: true,
    message: "Successfully fetched",
    song: song[0],
  });
});
export const getPlayList = asyncHandler(async (req: Request, res: Response) => {
  const { idArray } = req.body;
  // console.log(typeof idArray)
  if (!Array.isArray(idArray)) {
    return res.status(400).json({
      message: "Invalid ids",
      success: false,
    });
  }
  if (idArray.length === 0) {
    return res.status(200).json({
      message: "No ids to fetch playlist",
      success: true,
      playList: [],
    });
  }
  const rows = await sql`
    SELECT *
    FROM songs
    WHERE id = ANY(${idArray})
  `;

  return res.status(200).json({
    message: "fetched successfully",
    success: true,
    playList: rows,
  });
});
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {

    const result=await sql`SELECT * FROM categories`;
    return res.status(200).json({
      message:"Categories fetched successfully",
      success:true,
      categories:result
    })
  }
);
