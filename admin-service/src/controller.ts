import type { Request, Response } from "express";
import { asyncHandler, getBuffer, redisClient, sql } from "./utility.js";
import cloudinary from "cloudinary";
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}
export const addAlbum = asyncHandler(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      message: "Unauthorized access",
      success: false,
    });
    return;
  }
  const { title, description } = req.body;
  const file = req.file;
  if (!file) {
    res.status(400).json({
      message: "No file exist",
      success: false,
    });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
    return;
  }

  //    file upload
  let cloud;
  try {
    cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "albums",
      chunk_size: 2000000,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
    return;
  }

  const result = await sql`
INSERT INTO albums (title,description,thumbnail) VALUES (
${title},
${description},
${cloud.secure_url}
) RETURNING *
`;
  if (redisClient.isReady) {
    await redisClient.del("albums");
  }
  res.status(201).json({
    message: "Successfully added",
    success: true,
    album: result[0],
  });
  return;
});
export const addSong = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // console.log("add song called");
    if (req.user?.role !== "admin") {
      return res.status(401).json({
        message: "Unauthorize access",
        success: false,
      });
    }
    const { title, description, album } = req.body;
    const isAlbum = await sql`SELECT * FROM albums WHERE id=${album}`;
    // console.log(album);
    if (isAlbum.length === 0) {
      return res.status(404).json({
        message: "album not exist",
        success: false,
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Please pass audio file",
        success: false,
      });
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Server error",
        success: false,
      });
      return;
    }

    //    file upload
    let cloud;
    try {
      cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "songs",
        resource_type: "video",
        
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server error",
        success: false,
      });
      return;
    }

    const result = await sql`
  INSERT INTO songs (title,description,audio,album_id) VALUES 
  (${title},${description},${cloud.secure_url},${album}) RETURNING *
  `;
    // console.log(result);

    if(redisClient.isReady)
    {
      await redisClient.del('songs')
    }
    return res.status(201).json({
      message: "Song added successfully",
      success: true,
    });
  }
);
export const addThumbnail = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorize user",
        success: false,
      });
    }
    const songId = req.params.songId;
    const isSongAvailable = await sql`SELECT * FROM songs WHERE id=${songId}`;
    if (isSongAvailable.length == 0) {
      return res.status(400).json({
        message: "Invalid song id",
        success: false,
      });
    }
    const file = req.file;
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Server error",
        success: false,
      });
      return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "thumbnail",
    });
    const result = await sql`UPDATE songs
    SET thumbnail = ${cloud.secure_url}
    WHERE id=${songId}
    `;
    if(redisClient.isReady)
    {
      await redisClient.del("songs")
    }
    return res.status(200).json({
      message: "Thumbnail added successfully",
      success: true,
    });
  }
);
export const deleteAlbum = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      res.status(403).json({
        message: "Unauthorize Access",
        sussess: false,
      });
      return;
    }

    const { albumId } = req.params;
    // const result = await sql`SELECT * FROM albums WHERE id=${albumId}`;

    // if (result.length > 0 && result[0] !== undefined) {
    //   await cloudinary.v2.uploader.destroy(result[0].thumbnail);
    // }
    await sql`DELETE FROM songs WHERE album_id=${albumId}`;
    await sql`DELETE FROM albums WHERE id=${albumId}`;
    if(redisClient.isReady)
    {
      await redisClient.del("songs")
      await redisClient.del(`songs_of_album_${albumId}`)
    }
    if(redisClient.isReady)
    {
      await redisClient.del("albums")
    }
    res.status(200).json({
      sussess: true,
      message: "Album deleted successfully",
    });
    return;
  }
);

export const deleteSong = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      res.status(403).json({
        message: "Unauthorize Access",
        sussess: false,
      });
      return;
    }
    const { songId } = req.params;
    await sql`DELETE FROM songs WHERE id=${songId}`;
    if(redisClient.isReady)
    {
      await redisClient.del("songs")
      await redisClient.del(`song_${songId}`)
    }
    res.status(200).json({
      sussess: true,
      message: "Song deleted successfully",
    });
    return;
  }
);
