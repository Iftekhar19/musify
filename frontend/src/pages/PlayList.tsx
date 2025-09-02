import PlaylistSongs from "@/components/PlayListSong";
import { useAuth } from "@/context/AuthProvider";
import type { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const songs = [
  { id: "1", title: "Night Sky", duration: "3:42" },
  { id: "2", title: "Ocean Breeze", duration: "4:05" },
  { id: "3", title: "Lost in Time", duration: "5:01" },
  { id: "1", title: "Night Sky", duration: "3:42" },
  { id: "2", title: "Ocean Breeze", duration: "4:05" },
  { id: "3", title: "Lost in Time", duration: "5:01" },
  { id: "1", title: "Night Sky", duration: "3:42" },
  { id: "2", title: "Ocean Breeze", duration: "4:05" },
  { id: "3", title: "Lost in Time", duration: "5:01" },
];
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
  const [playlistSong, setPlaylistSong] = useState<PlayListSong[]>([]);
  // const { user } = useAuth();
  const [loading, setLoading] = useState<Boolean>(true);
  const {value}=useAuth()
  useEffect(() => {
    (async () => {
      try {
        const authUser = localStorage.getItem("authUser");
        const parsedAuthUser = authUser ? JSON.parse(authUser) : {};
        const { data } = await axios.post(
          "http://localhost:8002/api/v1/playlist",
          {
            idArray: parsedAuthUser?.playlist,
          }
        );
        setPlaylistSong(data.playList);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data?.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    })();
  }, [value]);
  return (
    <div className="px-0 flex flex-col h-full w-full gap-2">
      {loading ? (
        <div className="h-full w-full flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Playlist</h2>
          <PlaylistSongs
            songs={playlistSong}
            onPlaySong={(id) => console.log("Play:", id)}
            onDeleteSong={(id) => console.log("Delete:", id)}
          />
        </>
      )}
    </div>
  );
};

export default PlaylistPage;
