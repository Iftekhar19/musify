import PlaylistSongs from "@/components/PlayListSong";
import { useAuth } from "@/context/AuthProvider";
import { Link } from "react-router-dom";


// interface PlayListSong {
//   id: string;
//   title: string;
//   thumbnail: string;
//   audio: string;
//   created_at: string;
//   description: string;
//   album_id: string;
// }

const PlaylistPage = () => {

  const {user}=useAuth()
  return (
    <div className="px-0 flex flex-col h-full w-full gap-2">
         {
          user ?<>
          <h2 className="text-2xl font-bold mb-4">Playlist</h2>
          <PlaylistSongs
    
          />
          </>:<div className="h-full w-full flex flex-col justify-center items-center">
                <p>You are not logged in</p>
                <Link to={'/signin'}  className="text-lg font-bold  px-4 py-2 rounded-2xl underline">Login</Link>
          </div>
         } 
        
     
    </div>
  );
};

export default PlaylistPage;
