import ProfilePage from "@/components/ProfilePage";


const Profile = () => {
  return (
    <ProfilePage
      name="John Doe"
      email="johndoe@email.com"
      avatarUrl="https://randomuser.me/api/portraits/men/75.jpg"
      stats={{ playlists: 5, songs: 42, followers: 128 }}
      onEdit={() => console.log("Edit profile")}
      onLogout={() => console.log("Logout")}
    />
  );
};

export default Profile;
