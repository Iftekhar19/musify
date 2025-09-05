import PlaylistSongs from "@/components/PlayListSong";
import { useAuth } from "@/context/AuthProvider";
import type { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";


interface PlayListSong {
  id: string;
  title: string;
  thumbnail: string;
  audio: string;
  created_at: string;
  description: string;
  album_id: string;
}

const PlaylistPage = () => {
  // const [playlistSong, setPlaylistSong] = useState<PlayListSong[]>([]);
  // // const { user } = useAuth();
  // const [loading, setLoading] = useState<Boolean>(true);
  // const {value}=useAuth()
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const authUser = localStorage.getItem("authUser");
  //       const parsedAuthUser = authUser ? JSON.parse(authUser) : {};
  //       const { data } = await axios.post(
  //         "http://localhost:8002/api/v1/playlist",
  //         {
  //           idArray: parsedAuthUser?.playlist,
  //         }
  //       );
  //       setPlaylistSong(data.playList);
  //     } catch (error) {
  //       const axiosError = error as AxiosError<ApiResponse>;
  //       toast.error(axiosError.response?.data?.message || "Unexpected error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, [value]);
  const {playListSongs}=useAuth()
  return (
    <div className="px-0 flex flex-col h-full w-full gap-2">
  
          <h2 className="text-2xl font-bold mb-4">Playlist</h2>
          <PlaylistSongs
            songs={playListSongs}
            onPlaySong={(id) => console.log("Play:", id)}
            onDeleteSong={(id) => console.log("Delete:", id)}
          />
        
     
    </div>
  );
};

export default PlaylistPage;
