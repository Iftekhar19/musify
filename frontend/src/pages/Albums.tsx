import AlbumCard from "@/components/Album";
import axios from 'axios'
import { useEffect, useState } from "react";
interface AlbumInterface{
  title:string,
  thumbnail:string,
  id:string,
  description:string
}
const Albums = () => {
  const [albums,setAlbums]=useState<AlbumInterface[]>([])
  const [loading,setLoading]=useState(true)
  // const albums = [
  //   {
  //     title: "Midnight Vibes",
  //     artist: "DJ Aurora",
  //     cover:
  //       "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
  //   },
  //   {
  //     title: "Ocean Dreams",
  //     artist: "Luna Wave",
  //     cover:
  //       "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
  //   },
  //   {
  //     title: "Golden Hour",
  //     artist: "Solar Beats",
  //     cover:
  //       "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop",
  //   },
  //   {
  //     title: "Midnight Vibes",
  //     artist: "DJ Aurora",
  //     cover:
  //       "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
  //   },
  //   {
  //     title: "Ocean Dreams",
  //     artist: "Luna Wave",
  //     cover:
  //       "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
  //   },
  //   {
  //     title: "Golden Hour",
  //     artist: "Solar Beats",
  //     cover:
  //       "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop",
  //   },
  // ];
useEffect(()=>
{
  (async()=>
  {
    try {
    
      const {data}=await axios.get(`http://localhost:8002/api/v1/albums`)
      setAlbums(data.albums)
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }

  })()
},[])
  return (
    <div className="h-full w-full flex flex-col gap-3">
      {
        loading?<>
        <div className="h-full w-full flex justify-center items-center">
          Loading....
        </div>
        </>:
 
      <>
      <h1 className="text-xl font-bold py-2">Albums</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 ">
        {albums.map((album, idx) => (
          <AlbumCard
          id={album.id}
            key={idx+album.id}
            title={album.title}
            artist={album.description}
            cover={album.thumbnail}
            onPlay={() => console.log(`Playing ${album.title}`)}
          />
        ))}
      </div>
      </>
           }
    </div>
  );
};

export default Albums;
