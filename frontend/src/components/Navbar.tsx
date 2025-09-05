import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Sun, Moon, PlayCircleIcon, MenuIcon } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
interface NavbarProps{
open:boolean,
onOpenChange:(open:boolean)=>void;
}

const Navbar = ({onOpenChange}:NavbarProps) => {
  // const [theme, setTheme] = useState<"light" | "dark">("light");
  
const {signout,toggleTheme,theme}=useAuth()
  // Detect system preference & load saved theme
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  //   if (savedTheme) {
  //     setTheme(savedTheme);
  //     document.documentElement.classList.toggle("dark", savedTheme === "dark");
  //   } else {
  //     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  //     const systemTheme = prefersDark ? "dark" : "light";
  //     setTheme(systemTheme);
  //     document.documentElement.classList.toggle("dark", prefersDark);
  //   }
  // }, []);

  // Toggle theme
  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   setTheme(newTheme);
  //   localStorage.setItem("theme", newTheme);
  //   document.documentElement.classList.toggle("dark", newTheme === "dark");
  // };

  return (
    <nav className="w-full border-b shadow-sm bg-background">
      <div className="w-full px-4 h-14 flex items-center justify-between">
        {/* Left - App Name */}
        <h1 className="text-xl font-bold flex items-center justify-center gap-2 dark:text-green-400 "><MenuIcon  onClick={()=>onOpenChange(true)} className=" md:hidden dark:text-white text-black"/><PlayCircleIcon/> Musify</h1>

        {/* Right - Theme toggle + User dropdown */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
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
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
