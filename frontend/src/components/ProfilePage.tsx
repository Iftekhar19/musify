import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Music, ListMusic, Users, LogOut, Edit } from "lucide-react";

interface ProfilePageProps {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  stats?: {
    playlists: number;
    songs: number;
    followers: number;
  };
  onEdit?: () => void;
  onLogout?: () => void;
}

const ProfilePage = ({
  name,
  email,
  bio = "Music enthusiast who loves exploring new albums and artists.",
  avatarUrl,
  stats = { playlists: 0, songs: 0, followers: 0 },
  onEdit,
  onLogout,
}: ProfilePageProps) => {
  return (
    <div className="flex justify-center items-start w-full p-6">
      <Card className="w-full max-w-2xl rounded-xl shadow-md border border-border/50">
        <CardHeader className="flex flex-col items-center gap-3">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl font-semibold">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-center text-muted-foreground mt-1">{bio}</p>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          {/* Stats */}
          <div className="flex justify-around w-full">
            <div className="flex flex-col items-center">
              <ListMusic className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="font-semibold">{stats.playlists}</span>
              <span className="text-xs text-muted-foreground">Playlists</span>
            </div>
            <div className="flex flex-col items-center">
              <Music className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="font-semibold">{stats.songs}</span>
              <span className="text-xs text-muted-foreground">Songs</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="font-semibold">{stats.followers}</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
            <Button variant="destructive" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
