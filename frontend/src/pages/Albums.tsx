import AlbumCard from "@/components/Album";
import { useAuth } from "@/context/AuthProvider";
import type { categoryStructure } from "@/types/AllTypes";
import { Link } from "react-router-dom";

const Albums = () => {
  const { albums, categories } = useAuth();
  return (
    <div className="h-full w-full flex flex-col gap-3">
      {categories.map((cat: categoryStructure) => {
        return (
          <div className="flex flex-col gap-5">
           {albums && albums?.filter((al)=>al?.category==cat?.title).length>0&& <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold py-2 capitalize">{cat.title}</h1>
              <Link
                to={`/albums/${cat.title}`}
                className="underline font-semibold"
              >
                View All
              </Link>
            </div>}
            {
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 ">
                {albums
                  ?.filter((al) => al.category == cat.title)
                  .slice(0, 4)
                  ?.map((album) => (
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
            }
          </div>
        );
      })}
    </div>
  );
};

export default Albums;
