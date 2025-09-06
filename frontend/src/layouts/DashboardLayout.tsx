import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const {isMobile,song}=useAuth()
  // const [open,setOpen]=useState<boolean>(false)

  //   const onOpenChange=()=>
  //   {
  //       setOpen(!open)
  //   }

  return (
    <div className="h-[100dvh] max-w-[1440px] mx-auto w-full flex flex-col">
      {/* navbar */}
      {/* <div className='bg-yellow-400 h-[100px] w-full'>
       
     </div> */}
      {/* <Navbar open={open} onOpenChange={onOpenChange}/> */}
      <Navbar />
      {/* main section */}
      <div className="w-full flex-1 flex ">
        {/* sidebar for desktop */}
        <section className=" hidden md:block border h-full">
            <Sidebar/>
        </section>
        {/* side bar for mobile */}
        {/* <section className="md:hidden block">
         <MobileSidebar open={open} onOpenChange={onOpenChange}/>
        </section> */}

        {/* main content */}

        <div className="flex-1 h-[calc(100dvh-60px)] flex flex-col   px-1 md:px-4 pt-0 pb-2 overflow-y-auto">
          <div className=" flex items-center gap-2  h-[54px]  md:hidden overflow-x-auto">
            <Link className="h-8 flex justify-center items-center px-2 rounded-xl font-semibold dark:bg-white dark:text-black bg-black text-white" to={"/"}>Albums</Link>
            <Link className="h-8 flex justify-center items-center px-2 rounded-xl font-semibold dark:bg-white dark:text-black bg-black text-white" to={"/songs"}>Songs</Link>
            <Link className="h-8 flex justify-center items-center px-2 rounded-xl font-semibold dark:bg-white dark:text-black bg-black text-white" to={"/playlist"}>Playlist</Link>
            <Link className="h-8 flex justify-center items-center px-2 rounded-xl font-semibold dark:bg-white dark:text-black bg-black text-white" to={"/profile"}>Profile</Link>

          </div>
          <div className="h-full overflow-y-auto"> 

          <Outlet />
           </div>
        <div className="md:hidden mt-2">
{     (isMobile && song) &&   <MusicPlayer
// title="Shape of You"
// artist="Ed Sheeran"
// thumbnail="https://res.cloudinary.com/dpikyjfdy/image/upload/v1756634826/album-image-1_y9xl6g.avif"
// src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
/>}
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
