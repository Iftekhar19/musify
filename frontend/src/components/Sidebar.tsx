import { useAuth } from "@/context/AuthProvider";
import { Album, ListMusic, Music, User2Icon, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import MusicPlayer from "./MusicPlayer";


interface sidebarProps{
  label:string;
  icon:LucideIcon;
  link:string
}
interface sideBar{
  menuItems:sidebarProps[];
  title:string
}
  const menuItems = {
  "user":[

  
    { label: "Albums", icon: Album ,link:'/'},
    { label: "Songs", icon: Music,link:'/songs' },
    { label: "Playlist", icon: ListMusic, link:'/playlist'},
    { label: "Profile", icon: User2Icon,link:'/profile' },
  ],
  "admin":[
    { label: "Add Album", icon: Music,link:'/album/add' },
    { label: "Add Song", icon: User2Icon,link:'/song/add' },
     { label: "Categories", icon: Album ,link:'/categories'},
     { label: "Add Category", icon: ListMusic, link:'/category/add'},
  ]
  // You can add more items here — scroll will activate automatically
  };
const Sidebar = () => {
  const {isMobile,song,user}=useAuth()
  return (
    <aside className="w-[300px] h-full border-r bg-background flex flex-col">
      {/* App Name / Logo */}
      <div className="h-14 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold">Musify</h1>
      </div>

      {/* Scrollable Menu */}
      <nav className="flex-1 overflow-y-auto px-0 py-4">
        <p className="px-6 border-b mb-0 pb-2 text-[12px] font-bold">User Services</p>
        <ul className="space-y-2">
          {menuItems.user.map((item, index) => {
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
          {user?.role=="admin" && <p className="px-6 border-b mb-0 pb-2 text-[12px] font-bold">Admin Services</p>}
          {user?.role=="admin" && menuItems.admin.map((item, index) => {
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

                {(!isMobile && song) &&<MusicPlayer/>}
      </div>
    </aside>
  );
};

export default Sidebar;
