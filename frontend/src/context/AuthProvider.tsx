// src/context/AuthContext.tsx
import type { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
const song_server = "http://localhost:8002/api/v1";
const user_server = "http://localhost:8000/api/v1/users";
interface User {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  playlist: string[] | number[];
  role: string;
  isVerified: boolean;
}

// interface UserSignIn {
//   email: string;
//   password: string;
// }
export interface localStorageUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  playlist: number[] | string[];
  role: "user" | "admin";
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
interface Songs {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album_id: string;
  created_at: string;
}
export interface Albums {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;

  created_at: string;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  signout: () => void;
  // signin: ({ email, password }: UserSignIn) => Promise<void>;
  setValue?: (value: localStorageUser | null) => void;
  value?: localStorageUser | null;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  selectedSong: string | null;
  setSelectedSong: Dispatch<SetStateAction<string | null>>;
  songs: Songs[] | null;
  albums: Albums[] | null;
  setAlbums: Dispatch<SetStateAction<Albums[] | null>>;
  setSongs: Dispatch<SetStateAction<Songs[] | null>>;
  addToPlaylist: (id: string | number) => void;
  removeFromPlaylist: (id: string | number) => Promise<void>;
  playListSongs: Songs[];
  toggleTheme:()=>void;
  theme:string
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//  AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const authUser = localStorage.getItem("authUser");
  console.log(JSON.parse(authUser!));
  const parsedUser = authUser ? JSON.parse(authUser) : null;
  const [value, setValue, removeValue] =
    useLocalStorage<localStorageUser | null>("authUser", parsedUser);
      const storedTheme = localStorage.getItem("theme")||"light";

    const [theme,setTheme,removeTheme]=useLocalStorage<"light"|"dark">("theme",storedTheme=="light"?"light":"dark")
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [songs, setSongs] = useState<Songs[] | null>([]);
  const [albums, setAlbums] = useState<Albums[] | null>([]);
  const [playListSongs, setPlayListSongs] = useState<Songs[]>([]);

  // Load user from localStorage on mount
  // useEffect(() => {
  //   if (value) {
  //     const mappedUser: User = {
  //       _id: (value as any)._id ?? "",
  //       email: value.email,
  //       name: value.name,
  //       phone: value.phone,
  //       playlist: Array.isArray(value.playlist)
  //         ? value.playlist.map(String)
  //         : [],
  //       role: value.role,
  //       isVerified: value.isVerified,
  //     };
  //     setUser(mappedUser);
  //   }
  //   setLoading(false);
  // }, []);

  // const signin = async ({ email, password }: UserSignIn): Promise<void> => {
  //   try {
  //     const { data } = await axios.post(
  //       `http://localhost:8000/api/v1/users/signin`,
  //       { email, password }
  //     );

  //     setUser(data.user);
  //     localStorage.setItem("authUser", JSON.stringify(data.user));
  //   } catch (error) {
  //     console.error("Signin error:", error);
  //     throw error; // let caller handle error if needed
  //   }
  // };

  const signout = async ():Promise<void> => {
  try {
      await axios.post(`http://localhost:8000/api/v1/users/logout`,{
        
      },{withCredentials:true})
      setUser(null);
      removeValue();
      toast.success("Logged out successfully",{position:"top-right"})
      window.location.reload();
  } catch (error) {
     const AxiosError = error as AxiosError<ApiResponse>;
     toast.error(AxiosError.message,{position:"top-right"})
  }
  };

  const fetchSongs = useCallback(async () => {
    try {
      const { data } = await axios.get(`${song_server}/songs`);
      setSongs(data?.songs || []);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchAlbums = useCallback(async () => {
    try {
      const { data } = await axios.get(`${song_server}/albums`);
      setAlbums(data?.albums || []);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchPlayList = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${song_server}/playlist`,
        { idArray: value?.playlist },
        { withCredentials: true }
      );
      console.log(data);
      setPlayListSongs(data?.playList || []);
    } catch (error) {
      console.log(error);
    }
  }, [value]);
  const fetchPRofile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${user_server}/profile`, {
        withCredentials: true,
      });
      console.log("data from fetch profile");
      console.log(data.user);
      setUser(data.user);
      setValue(data.user);
    } catch (error) {
      removeValue();
      console.log(error);
    }
  }, []);
  const addToPlaylist = async (id: string | number) => {
    const myPlaylist: number[] = (value?.playlist ?? []).map(Number);

    const isExist = myPlaylist?.find((li) => li == id);
    if (isExist) {
      toast.error("Already exist", { position: "top-right" });
    } else {
      try {
        await axios.post(
          `${user_server}/playlist/add`,
          {
            songId: id,
          },
          { withCredentials: true }
        );
        myPlaylist?.push(Number(id));
        if (value) value.playlist = myPlaylist;
        setValue({ ...value! });
        toast.success("Added to playlist", { position: "top-right" });
      } catch (error) {
        console.log(error);
        toast.error("Unale to add playlist", { position: "top-right" });
      }
    }
  };
  const removeFromPlaylist = async (id: string | number) => {
    const myPlaylist: number[] = (value?.playlist ?? []).map(Number);

    try {
      await axios.delete(`${user_server}/playlist/remove/${id}`, {
        withCredentials: true,
      });
      const newPlaylist = myPlaylist.filter((li) => li != id);
      if (value) value.playlist = newPlaylist;
      setValue({ ...value! });
      toast.success("Removed from playlist", { position: "top-right" });
    } catch (error) {
      console.log(error);
      toast.error("Unale to remove playlist", { position: "top-right" });
    }
  };
  useEffect(() => {
    (async () => {
      try {
        await fetchPRofile();
        await fetchAlbums();
        await fetchSongs();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        console.log("fetched Playlist called");
        await fetchPlayList();
      } catch (error) {
        toast.error("Unable to load playList");
        console.log(error);
      }
    })();
  }, [value]);
    useEffect(() => {
    // const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (theme) {
      // setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);
    const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        signout,
        value,
        setValue,
        isPlaying,
        setIsPlaying,
        selectedSong,
        setSelectedSong,
        albums,
        songs,
        setAlbums,
        setSongs,
        addToPlaylist,
        removeFromPlaylist,
        playListSongs,
        toggleTheme,
        theme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
