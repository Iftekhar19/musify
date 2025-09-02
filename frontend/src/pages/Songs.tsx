import SongList from "@/components/SongList";
import { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Song {
  id: string;
  title: string;
  description?: string;
  thumbnail?:string,
  duration?:string,
  album_id:string,
  auido:string
}



const SongsPage = () => {
 
  const [songs,setSongs]=useState<Song[]>([])
  const [loading,setLoading]=useState<boolean>(true)
  useEffect(()=>
  {
    (async()=>
    {
      try {
        
        const {data}= await axios.get(`http://localhost:8002/api/v1/songs`)
        setSongs(data.songs)
      } catch (error) {
        toast.error("Unable to fetch songs",{position:"top-right"})
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
          Loading....
      </div>
      </>:
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold mb-4">All Songs</h2>
      <SongList
      songs={songs}
      onPlaySong={(id: string) => console.log("Play song:", id)}

      />
    </div>
    }
    
    </>
  );
};

export default SongsPage;
