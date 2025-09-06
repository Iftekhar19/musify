import ProfilePage from "@/components/ProfilePage";
import { useAuth } from "@/context/AuthProvider";
import { Link } from "react-router-dom";


const Profile = () => {
  const {user}=useAuth()
  return (
    <>
 { user?  <ProfilePage
      name="John Doe"
      email="johndoe@email.com"
      avatarUrl="https://randomuser.me/api/portraits/men/75.jpg"
      stats={{ playlists: 5, songs: 42, followers: 128 }}
      onEdit={() => console.log("Edit profile")}
      onLogout={() => console.log("Logout")}
    />:<div className="flex flex-col justify-center items-center h-full w-full">
<p>You are not logged in</p>
                <Link to={'/signin'} className="text-lg font-bold  px-4 py-2 rounded-2xl underline">Login</Link>
    </div>
  }
    </>
  );
};

export default Profile;
