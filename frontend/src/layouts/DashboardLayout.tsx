import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/Sidebarmodal";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    const [open,setOpen]=useState<boolean>(false)

    const onOpenChange=()=>
    {
        setOpen(!open)
    }

  return (
    <div className="h-[100dvh] max-w-[1440px] mx-auto w-full flex flex-col">
      {/* navbar */}
      {/* <div className='bg-yellow-400 h-[100px] w-full'>
       
     </div> */}
      <Navbar open={open} onOpenChange={onOpenChange}/>
      {/* main section */}
      <div className="w-full flex-1 flex ">
        {/* sidebar for desktop */}
        <section className=" hidden md:block border h-full">
            <Sidebar/>
        </section>
        {/* side bar for mobile */}
        <section className="md:hidden block">
         <MobileSidebar open={open} onOpenChange={onOpenChange}/>
        </section>

        {/* main content */}

        <div className="flex-1 h-[calc(100dvh-60px)] flex flex-col  px-4 py-3 overflow-y-auto">
          <div className="h-full overflow-y-auto"> 

          <Outlet />
           </div>
        <div className="md:hidden mt-2">
          <MusicPlayer
  title="Shape of You"
  artist="Ed Sheeran"
  thumbnail="https://res.cloudinary.com/dpikyjfdy/image/upload/v1756634826/album-image-1_y9xl6g.avif"
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
