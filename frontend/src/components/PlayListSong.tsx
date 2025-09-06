import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthProvider";
import { Music, PlayCircle, Trash2 } from "lucide-react";
import { useState } from "react";

const PlaylistSongs = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { removeFromPlaylist, playListSongs, playPlaylistSongs, selectedSong } =
    useAuth();

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await removeFromPlaylist(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Card className="rounded-xl px-0 shadow-md border border-border/50 w-full dark:bg-transparent bg-white mx-auto">
        <CardContent className="px-2">
          {playListSongs.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              No songs in your playlist.
            </p>
          ) : (
            <div className="divide-y">
              {playListSongs.map((song, idx) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between py-3 px-2  hover:bg-muted/40 rounded-md transition"
                >
                  {/* Song info */}
                  <div
                    className={`flex items-center gap-3 ${
                      song?.id == selectedSong ? "text-green-400" : ""
                    }`}
                  >
                    <div className="h-6 w-6 flex justify-center  items-center ">
                      {song?.thumbnail ? (
                        <img
                          className="h-full w-full bg-cover"
                          src={song?.thumbnail}
                        />
                      ) : (
                        <Music
                          color={song?.id == selectedSong ? "green" : "gray"}
                          className={`h-full w-full text-muted-foreground `}
                        />
                      )}
                    </div>
                    {/* <Music className="h-5 w-5 text-muted-foreground" /> */}
                    <div className="flex flex-col ">
                      <span className="font-medium text-[14px]">
                        {song.title}
                      </span>
                      <span className="text-[12px]">{song?.description}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {/* {song.duration} */}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => playPlaylistSongs(idx)}
                      className="cursor-pointer h-8 w-8"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive cursor-pointer"
                      onClick={() => setDeleteId(String(song.id))}
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
            Are you sure you want to delete this song from your playlist? This
            action cannot be undone.
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
