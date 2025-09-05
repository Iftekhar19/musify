import SongList from "@/components/SongList";
import { useAuth } from "@/context/AuthProvider";

const SongsPage = () => {
  const { songs } = useAuth();
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold mb-4">All Songs</h2>
      <SongList
        songs={songs}
        onPlaySong={(id: string | number) => console.log("Play song:", id)}
      />
    </div>
  );
};

export default SongsPage;
