import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import {
  Moon,
  PlayCircleIcon,
  Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// interface NavbarProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

const Navbar = () => {
  const { signout, toggleTheme, theme,user } = useAuth();
  const navigate=useNavigate();

  return (
    <nav className="w-full border-b shadow-sm bg-background">
      <div className="w-full px-2 md:px-4 h-14 flex items-center justify-between">
        {/* Left - App Name */}
        <h1 className="text-xl font-bold flex items-center justify-center gap-2  ">
          {/* <MenuIcon
            onClick={() => onOpenChange(true)}
            className=" md:hidden dark:text-white text-black"
          /> */}
          <PlayCircleIcon /> Musify
        </h1>

        {/* Right - Theme toggle + User dropdown */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="cursor-pointer" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User Dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={signout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          {
            user?<Button onClick={signout} className="bg-red-700 cursor-pointer hover:bg-red-600 text-white  rounded-[10px] px-3 py-1 h-8">Log Out</Button>:
         <Button onClick={()=>navigate(`/signin`)} className="cursor-pointer   rounded-xl px-3 py-1 h-8">Sign In</Button>
         }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
