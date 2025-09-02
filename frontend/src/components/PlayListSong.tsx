import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthProvider";
import { removeFromPlaylist } from "@/helper/helper";
import { Music, PlayCircle, Trash2 } from "lucide-react";
import { useState } from "react";

interface Song {
   id: string;
  title: string;
  thumbnail: string;
  audio: string;
  created_at: string;
  description: string;
  album_id: string;
}

interface PlaylistProps {
  title?: string;
  songs: Song[];
  onPlaySong?: (id: string) => void;
  onDeleteSong?: (id: string) => void;
}

const PlaylistSongs = ({ songs, onPlaySong, onDeleteSong }: PlaylistProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const {setValue}=useAuth()

  const handleConfirmDelete = async() => {
    if (deleteId) {
     await removeFromPlaylist(deleteId)
       const authUser=localStorage.getItem("authUser")
       const parsedUser=authUser?JSON.parse(authUser):null
       const playList=parsedUser.playlist
       const newPlaylist=playList.filter((i:any)=>i!=deleteId)
       parsedUser.playlist=newPlaylist
       if (parsedUser && typeof setValue === "function") {
           setValue(parsedUser);
       
       }
      //  else{
        
      //  }
      setDeleteId(null);
    } 
  };

  return (
    <>
      <Card className="rounded-xl px-0 shadow-md border border-border/50 w-full dark:bg-transparent bg-white mx-auto">
        {/* <CardHeader>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader> */}
        <CardContent className="px-2">
          {/* <ScrollArea className="h-[400px]"> */}
            {songs.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No songs in your playlist.
              </p>
            ) : (
              <div className="divide-y">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between py-3 px-2  hover:bg-muted/40 rounded-md transition"
                  >
                    {/* Song info */}
                    <div className="flex items-center gap-3">
                      <Music className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{song.title}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {/* {song.duration} */}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onPlaySong?.(song.id)}
                      >
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(song.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {/* </ScrollArea> */}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove from Playlist?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this song from your playlist? This action cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaylistSongs;
