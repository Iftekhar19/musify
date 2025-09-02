import axios from "axios";
import { toast } from "sonner";

export const addToPlaylist = async (id: string): Promise<void> => {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/users/playlist/add`,
      {
        songId: id,
      },
      { withCredentials: true }
    );
    const authUser = localStorage.getItem("authUser");
    const parsedUser =  JSON.parse(authUser!);
    const playList = parsedUser?.playlist;
    console.log(parsedUser)
    playList.push(id);
    localStorage.setItem("authUser", JSON.stringify(parsedUser));
    toast.success("added to playlist", {
      position: "top-right",
    });
    console.log(data);
  } catch (error) {
    console.log(error);
    toast.error("unable to add playlist", {
      position: "top-right",
    });
  }
};
export const removeFromPlaylist = async (id: string): Promise<void> => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8000/api/v1/users/playlist/remove/${id}`,
      {
        withCredentials: true,
      }
    );
    // const authUser = localStorage.getItem("authUser");
    // const parsedUser = authUser ? JSON.parse(authUser) : {};
    // const playList = parsedUser?.playlist;
    // let newPlaylist = playList.filter((listid: string) => listid != id);
    // parsedUser.playlist = newPlaylist;
    // localStorage.setItem("authUser", JSON.stringify(parsedUser));
    console.log(data);
    toast.success("removed from playlist", {
      position: "top-right",
    });
  } catch (error) {
    console.log(error);
    toast.error("unable to delete from playlist", {
      position: "top-right",
    });
  }
};
