import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Album, ListMusic, Music, PlayCircle, User2Icon } from "lucide-react";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { label: "Albums", icon: Album },
  { label: "Songs", icon: Music },
  { label: "Playlist", icon: ListMusic },
  { label: "Profile", icon: User2Icon },
];

const MobileSidebar = ({ open, onOpenChange }: MobileSidebarProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[250px] p-0 flex flex-col bg-background"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-lg font-semibold dark:text-green-400 flex items-center gap-2"><PlayCircle className="mt-[3px]"/>Musefy</SheetTitle>
        </SheetHeader>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition"
                    onClick={() => onOpenChange(false)} // close on click
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
