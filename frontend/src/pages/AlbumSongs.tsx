import AlbumDetails from "@/components/AlbumDetails";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// interface Song {
//   id: string;
//   title: string;
//   description?: string;
//   thumbnail?:string,
//   duration?:string,
//   album_id:string,
//   auido:string
// }
interface Album {
  
    id: string;
    title: string;
    description: string;
    thumbnail?:string,
  }


const AlbumPage = () => {
  const params=useParams();
    // const [songs,setSongs]=useState<Song[]>([])
  const [album,setAlbum]=useState<Album>({
    id: "",
    title: "",
    description: "",
    thumbnail: ""
  })
  const {setAlbumSongs}=useAuth()
  const [loading,setLoading]=useState<Boolean>(true)

useEffect(()=>
{
  (async()=>
  {
    try {
      const {data}=await axios.get(`http://localhost:8002/api/v1/album/${params.id}/songs`)
      setAlbum(data.album)
      // setSongs(data.songs)
      setAlbumSongs(data.songs)
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  })()

},[])
  return (
    <>

    {
      loading ?<>
      <div className="h-full w-full flex justify-center items-center">
      Loading.....
      </div>
      </>:
  
    
      <AlbumDetails
      album={album}
      // songs={songs}
      // onPlaySong={(id) => console.log("Play song:", id)}
      // onLikeSong={(id) => console.log("Like song:", id)}
      />
    }
    </>
  );
};

export default AlbumPage;
