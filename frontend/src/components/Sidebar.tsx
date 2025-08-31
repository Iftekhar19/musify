import { Album, Music, ListMusic,User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import MusicPlayer from "./MusicPlayer";

const menuItems = [
  { label: "Albums", icon: Album ,link:'/dashboard'},
  { label: "Songs", icon: Music,link:'/dashboard/songs' },
  { label: "Playlist", icon: ListMusic, link:'/dashboard/playlist'},
  { label: "Profile", icon: User2Icon,link:'/dashboard/profile' },
  // You can add more items here — scroll will activate automatically
];

const Sidebar = () => {
  return (
    <aside className="w-[300px] h-full border-r bg-background flex flex-col">
      {/* App Name / Logo */}
      <div className="h-14 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold">Musefy</h1>
      </div>

      {/* Scrollable Menu */}
      <nav className="flex-1 overflow-y-auto px-0 py-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index} className="hover:bg-accent hover:text-accent-foreground px-6 cursor-pointer" >
                <Link to={item.link}>
                <button
                  className="cursor-pointer flex items-center w-full px-0 py-2 text-sm font-medium rounded-lg  transition"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="hidden md:block">

                <MusicPlayer
  title="Shape of You"
  artist="Ed Sheeran"
  thumbnail="https://res.cloudinary.com/dpikyjfdy/image/upload/v1756634826/album-image-1_y9xl6g.avif"
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
/>
      </div>
    </aside>
  );
};

export default Sidebar;
