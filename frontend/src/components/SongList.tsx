import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { Heart, Music, Play } from "lucide-react";
import { toast } from "sonner";
import { addToPlaylist } from "../helper/helper";
interface Song {
  id: string;
  title: string;
  description?: string;
  thumbnail?:string,
  duration?:string,
  album_id:string,
  auido:string
}

interface SongListProps {
  songs: Song[];
  onPlaySong?: (songId: string) => void;

  // onLikeSong?: (songId: string) => void;
}


const SongList = ({ songs, onPlaySong }: SongListProps) => {
  const {value,setValue}=useAuth()
const  addPlay= async function(id:string):Promise<void> {
  // console.log(JSON.parse(value!))
  try {
    const authUser=localStorage.getItem("authUser")
    const parsedUser=authUser?(JSON.parse(authUser)):{}
    const playList=parsedUser?.playlist
    const isExist=playList.some((i:any)=>i==id)
    if(isExist)
    {
      toast.error("Already exist",{position:"top-right"})
    }
    else{

      await addToPlaylist(id)
      
      playList?.push(id)
  
      if (setValue) {
        setValue(parsedUser);
      }
    }

  } catch (error) {
    console.log("Unable to add playlist")
  }
}

  return (
    <Card className="rounded-xl shadow-md border border-border/50 bg-white dark:bg-transparent">
      <CardContent className="divide-y px-2">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between py-3 px-2 hover:bg-muted/40 rounded-md transition"
          >
            {/* Song Info */}
            <div className="flex items-center gap-3">
              <Music className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{song.title}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {song.duration}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={()=>addPlay(song.id)}
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="rounded-full"
                onClick={() => onPlaySong?.(song.id)}
              >
                <Play className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SongList;
