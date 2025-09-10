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
  const albumData=req.body.data
  const { title, description, category_id } = JSON.parse(albumData);
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
INSERT INTO albums (title,description,thumbnail,category_id) VALUES (
${title},
${description||""},
${cloud.secure_url},
${category_id}
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
    const songData=req.body.data
    const { title, description, album, category } = JSON.parse(songData);
    // const isAlbum = await sql`SELECT * FROM albums WHERE id=${album}`;
    // if (isAlbum.length === 0) {
    //   return res.status(404).json({
    //     message: "album not exist",
    //     success: false,
    //   });
    // }

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
  INSERT INTO songs (title,description,audio,album_id,category_id) VALUES 
  (${title},${description},${cloud.secure_url},${album},${category}) RETURNING *
  `;
    // console.log(result);

    if (redisClient.isReady) {
      await redisClient.del("songs");
      await redisClient.del(`songs_of_album_${album}`);
    }
    return res.status(201).json({
      message: "Song added successfully",
      success: true,
      song:result
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
    if (redisClient.isReady) {
      await redisClient.del("songs");
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
    if (redisClient.isReady) {
      await redisClient.del("songs");
      await redisClient.del(`songs_of_album_${albumId}`);
    }
    if (redisClient.isReady) {
      await redisClient.del("albums");
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
    if (redisClient.isReady) {
      await redisClient.del("songs");
      await redisClient.del(`song_${songId}`);
    }
    res.status(200).json({
      sussess: true,
      message: "Song deleted successfully",
    });
    return;
  }
);
export const addCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorize user",
        success: false,
      });
    }
    const file=req.file
    const categoryData = req.body.data;
    console.log(categoryData)
    const {title,description}=JSON.parse(categoryData)
    console.log(title,description)
    if (!title) {
      return res.status(400).json({
        message: "title is required",
        success: false,
      });
    }
    let cloud;
    
    if(file)
    {
      const fileBuffer=getBuffer(file)
      if(fileBuffer&&fileBuffer.content)
      {
          cloud=  await cloudinary.v2.uploader.upload(fileBuffer.content,{
         folder:"thumbnail"
        })
      }

    }
    // const file = req.file;
    //  console.log(title)
    // const fileBuffer = getBuffer(file);
    // let cloud;
    // if(file)
    // {
    // try {
    //   cloud=  await cloudinary.v2.uploader.upload(fileBuffer.content!,{
    //      folder:"thumbnail"
    //     })
    // } catch (error) {
    //   console.log(error)
    //   return res.status(500).json({
    //     message:"Server error from cloudinary",
    //     success:false
    //   })
    // }
    // }
    let result = await sql`INSERT INTO categories (title,description,thumbnail) VALUES 
    (${title},${description || ""},${cloud?cloud.secure_url:""}) RETURNING *`;

    return res.status(201).json({
      message: "Category added successfully",
      success: true,
      category: result,
    });
  }
);
export const deleteCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorize user",
        success: false,
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "id is required",
        success: false,
      });
    }
    const result = await sql`DELETE FROM categories WHERE id = ${id}`;
    return res.status(200).json({
      message: `Category with id ${id} is deleted`,
      success: true,
    });
  }
);
export const updateCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorize user",
        success: false,
      });
    }
    const { id } = req.params;
    // console.log(id);
    // console.log(req.body);
    const catData=req.body.data
    const { description,title } = JSON.parse(catData)
    if (!id) {
      return res.status(400).json({
        message: "id is required",
        success: false,
      });
    }
    const file=req.file
    // console.log(file)
    // const file = req.file;
    // const fileBuffer = getBuffer(file);

    // if (!fileBuffer || !fileBuffer.content) {
    //   return res.status(400).json({
    //     message: "Thumbnail is required",
    //     success: false,
    //   });
    // }
    // let cloud;
    // try {
    //   cloud = await cloudinary.v2.uploader.upload(fileBuffer.content!, {
    //     folder: "thumbnail",
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({
    //     message: "Server error from cloudinary",
    //     success: false,
    //   });
    // }
let cloud;
    if(file){
      const fileBuffer=getBuffer(file)

      if(fileBuffer && fileBuffer.content)
      {
   cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "thumbnail",
      });
      }
    }
    let result
 if(cloud)
 {

    result= await sql`UPDATE categories SET description=${description||""}, title=${title},thumbnail=${cloud?cloud.secure_url:""} WHERE id=${id}`;
 }
 else{
      result= await sql`UPDATE categories SET description=${description||""}, title=${title} WHERE id=${id}`;

 }
  

    
    return res.status(200).json({
      message: "Updated successfully",
      success: true,
      result
    });
  }
);

