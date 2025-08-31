import PlaylistSongs from "@/components/PlayListSong";


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

const PlaylistPage = () => {
  return (
    <div className="px-0 flex flex-col gap-2">
      <h2 className="text-2xl font-bold mb-4">Playlist</h2>
      <PlaylistSongs
        songs={songs}
        onPlaySong={(id) => console.log("Play:", id)}
        onDeleteSong={(id) => console.log("Delete:", id)}
      />
    </div>
  );
};

export default PlaylistPage;
