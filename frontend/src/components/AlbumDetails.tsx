import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { Heart, Music, Pause, Play, PlayIcon, Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "./DeleteDialog";
import { useState } from "react";

// interface Song {
//   id: string;
//   title: string;
//   description?: string;
//   thumbnail?: string;
//   duration?: string;
//   album_id: string;
//   auido: string;
// }

interface AlbumDetailsProps {
  album: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
  };
}

const AlbumDetails = ({
  album,

}: AlbumDetailsProps) => {
  const { addToPlaylist,albumSongs,playAlbumSongs,selectedSong,isPlaying,user } = useAuth();
   const [openDialog, setOpenDialog] = useState(false);
   const [deleteId,setDeleteId]=useState<string|number|null>(null)

    const handleDelete = async (id:string|number|null) => {
    try {
      alert(id)
      // setLoading(true);
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Album deleted:", id);
      setOpenDialog(false);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      // setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6 py-6 h-full">
      {/* Album Info */}
      <div className="flex flex-row gap-6 items-start">
        <img
          src={album.thumbnail}
          alt={album.title}
          className="w-30 h-30 md:w-48 md:h-48 object-cover rounded-xl shadow-md"
        />

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold capitalize">
            {album.title.substring(0, 25)}
          </h1>
          {/* <p className="text-muted-foreground text-sm">{album.artist}</p> */}
          <p className="text-sm  max-w-lg">
            {album.description.substring(0, 50)}
          </p>
          <div>
            <Button onClick={()=>playAlbumSongs(0)} title="Play" className="cursor-pointer  rounded-full h-12 w-12 ">{isPlaying ?<Pause className="h-12 w-12 rounded-full text-white dark:text-black"/>:<PlayIcon className="h-12 w-12 rounded-full text-white dark:text-black" />}</Button>
          </div>
        </div>
      </div>

      {/* Song List */}
      {albumSongs.length > 0 ? (
        <Card className="rounded-xl bg-transparent shadow-md border border-border/50">
          <CardContent className="divide-y md:px-2 px-1">
            {albumSongs.map((song,idx) => (
              <div
                key={song.id}
                className="flex items-center justify-between py-3  hover:bg-muted/40 rounded-md transition"
              >
                {/* Song Info */}
                 <div className={`flex items-center gap-3 ${(song?.id==selectedSong)?"text-green-400":""}`}>
              <div className="h-8 w-8 p-2 flex justify-center  items-center ">

              {song?.thumbnail ?<img className="h-full w-full bg-cover" src={song?.thumbnail}/>:<Music color={song?.id==selectedSong?"green":"gray"} className={`h-full w-full text-muted-foreground `} />}
              </div>
              {/* <Music className="h-5 w-5 text-muted-foreground" /> */}
              <div className="flex flex-col ">

              <span className="font-medium text-[14px]">{song.title}</span>
              <span className="text-[12px]">{song?.description}</span>
              </div>
            </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* <span className="text-sm text-muted-foreground">
                    {song.description}
                  </span> */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => addToPlaylist(song.id)}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                     className="rounded-full cursor-pointer"
                    onClick={() => playAlbumSongs(idx)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
              { user?.role=="admin" &&   <Button
                    size="icon"
                    variant={"destructive"}
                    className="rounded-full cursor-pointer"
                    onClick={() => {
                      setDeleteId(song.id)
                      setOpenDialog(true)
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <h1>No songs availabel for this album</h1>
        </div>
      )}
      <ConfirmDeleteDialog
      onConfirm={()=>handleDelete(deleteId)}
      onOpenChange={setOpenDialog}
      open={openDialog}
      title="Delete Song"
      />
    </div>
  );
};

export default AlbumDetails;
