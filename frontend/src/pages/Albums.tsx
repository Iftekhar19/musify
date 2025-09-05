import AlbumCard from "@/components/Album";
import { useAuth } from "@/context/AuthProvider";

const Albums = () => {
  const { albums } = useAuth();
  // console.log(albums);
  return (
    <div className="h-full w-full flex flex-col gap-3">
      <h1 className="text-xl font-bold py-2">Albums</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 ">
        {albums?.map((album, idx) => (
          <AlbumCard
            id={album.id}
            key={album.id}
            title={album.title}
            artist={album.description}
            cover={album.thumbnail}
            onPlay={() => console.log(`Playing ${album.title}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Albums;
