import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart, Music } from "lucide-react";
import { addToPlaylist } from "@/helper/helper";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";

interface Song {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  album_id: string;
  auido: string;
}

interface AlbumDetailsProps {
  album: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
  };
  songs: Song[];
  onPlaySong?: (songId: string) => void;
  onLikeSong?: (songId: string) => void;
}

const AlbumDetails = ({
  album,
  onPlaySong,
  onLikeSong,
  songs,
}: AlbumDetailsProps) => {
  const { value, setValue } = useAuth();
  const addPlay = async function (id: string): Promise<void> {
    // console.log(JSON.parse(value!))
    try {
      console.log(value);

      const playList = value?.playlist;
      const isExist = playList?.some((i: any) => i == id);
      if (isExist) {
        toast.error("Already exist", { position: "top-right" });
      } else {
        await addToPlaylist(id);

        playList?.push(Number(id));

        if (setValue) {
          setValue(value!);
        }
      }
    } catch (error) {
      console.log("Unable to add playlist");
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

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold capitalize">
            {album.title.substring(0, 25)}
          </h1>
          {/* <p className="text-muted-foreground text-sm">{album.artist}</p> */}
          <p className="text-sm mt-2 max-w-lg">
            {album.description.substring(0, 50)}
          </p>
        </div>
      </div>

      {/* Song List */}
      {songs.length > 0 ? (
        <Card className="rounded-xl bg-transparent shadow-md border border-border/50">
          <CardContent className="divide-y md:px-2 px-1">
            {songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between py-3  hover:bg-muted/40 rounded-md transition"
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
                    onClick={() => addPlay(song.id)}
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
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <h1>No songs availabel for this album</h1>
        </div>
      )}
    </div>
  );
};

export default AlbumDetails;
