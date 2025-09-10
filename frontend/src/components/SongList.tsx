import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { Heart, Music, Play, Trash } from "lucide-react";
import ConfirmDeleteDialog from "./DeleteDialog";
import { useState } from "react";
import type { Songs } from "@/types/AllTypes";


interface SongListProps {
  songs: Songs[]|null;
  // onPlaySong?: (songId: string|number) => void;
}

const SongList = ({ songs }: SongListProps) => {
const {addToPlaylist,playSongs,selectedSong,user}=useAuth()
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
    <Card className="rounded-xl shadow-md border border-border/50 bg-white dark:bg-transparent">
      <CardContent className="divide-y px-2">
        {songs?.map((song,idx) => (
          <div
            key={song.id}
            className={`flex items-center justify-between py-3  px-2 hover:bg-muted/40 rounded-md transition `}
          >
            {/* Song Info */}
            <div className={`flex items-center gap-3 ${song?.id==selectedSong?"text-green-400":""}`}>
              <div className="h-6 w-6 flex justify-center  items-center ">

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
                {song?.duration}
              </span> */}
           
              <Button
                size="icon"
                variant="ghost"
                onClick={() => addToPlaylist(String(song?.id))}
                className="cursor-pointer"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="rounded-full cursor-pointer h-8 w-8"
                onClick={() => playSongs(idx)}
                
              >
                <Play className="h-5 w-5" />
              </Button> 
              {user?.role=="admin" && <Button
                size="icon"
                variant={"destructive"}
                className="rounded-full cursor-pointer h-8 w-8"
                onClick={() => {
                  setDeleteId(song?.id)
                  setOpenDialog(true)
                }}
                
              >
                <Trash className="h-5 w-5" />
              </Button> }
              
             
            </div>
          </div>
        ))}
      </CardContent>
      <ConfirmDeleteDialog
       onConfirm={()=>handleDelete(deleteId)}
       onOpenChange={setOpenDialog}
       open={openDialog}
      />
    </Card> 
  );
};

export default SongList;
