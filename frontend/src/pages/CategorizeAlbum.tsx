import AlbumCard from "@/components/Album";
import { useAuth } from "@/context/AuthProvider";
import { useParams } from "react-router-dom";

const CategorizeAlbum = () => {
  const { albums } = useAuth();
  const params=useParams()
//   alert(params.category)
  return (
    <div className="h-full w-full flex flex-col gap-3">
      <h1 className="text-xl font-bold py-2">{params.category?.split(" ")[0]} Albums</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 ">
        {albums?.filter((album)=>album.category===params.category).map((album) => (
          <AlbumCard
            id={album.id}
            key={album.id}
            title={album.title}
            artist={album.description}
            cover={album.thumbnail}
            category={album.category}
          />
        ))}
      </div>
    </div>
  )
}

export default CategorizeAlbum