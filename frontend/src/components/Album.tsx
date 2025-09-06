import { Card, CardContent } from "@/components/ui/card";
import { Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  id:string|number
  title: string;
  artist?: string;
  cover: string;
  onPlay?: () => void;
  onLike?: () => void;
}

const AlbumCard = ({ title, artist, cover, onPlay, onLike,id }: AlbumCardProps) => {
    const router=useNavigate()
  return (
    <Card onClick={()=>router(`/albums/${id}`)} className="group cursor-pointer relative max-w-[250px] w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-md border border-border/50 transition-all duration-300">
      {/* Album Cover */}
      <div className="relative">
        <img
          src={cover}
          alt={title}
          className="h-[150px] w-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay with Play Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-transform"
            onClick={onPlay}
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>

        {/* Like Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background shadow"
          onClick={onLike}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Album Info */}
      <CardContent className="p-4">
        <h3 className="font-semibold truncate text-base">{title}</h3>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
