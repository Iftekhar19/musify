// src/context/AuthContext.tsx
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { useLocalStorage } from "usehooks-ts";

interface User {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  playlist: string[];
  role: string;
}

interface UserSignIn {
  email: string;
  password: string;
}
export interface localStorageUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  playlist: number[]; 
  role: "user" | "admin"; 
  isVerified: boolean;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>; 
  loading: boolean;
  signout: () => void;
  signin: ({ email, password }: UserSignIn) => Promise<void>;
  setValue?:(value:localStorageUser|null)=>void;
  value?:localStorageUser;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//  AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authUser = localStorage.getItem("authUser");
  console.log(JSON.parse(authUser!))
  const parsedUser = authUser ? (JSON.parse(authUser)) : {};
  const [value, setValue, removeValue] = useLocalStorage(
    "authUser",
    parsedUser
  );

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    
      
    }
    setLoading(false);
  }, []);

  const signin = async ({ email, password }: UserSignIn): Promise<void> => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/users/signin`,
        { email, password }
      );

      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));
    } catch (error) {
      console.error("Signin error:", error);
      throw error; // let caller handle error if needed
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signout, signin,value,setValue }}>
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
