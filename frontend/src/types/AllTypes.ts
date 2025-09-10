export interface categoryStructure{
  id:number|string;
  description:number|string|null;
  thumbnail:string|null;
  title:string|null;
  created_at:string|null
}
export interface Albums {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;

  created_at: string;
  category:string;
}
export interface AlbumCardProps {
  id: string | number;
  title: string;
  artist?: string;
  cover: string;
  category:string;
}
// export interface Song {
//   id: string | number;
//   title: string;
//   description: string;
//   thumbnail: string;
//   audio: string;
//   album_id: string;
//   created_at: string;
//   category:string;
// }
export interface Songs {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album_id: string;
  created_at: string;
  category:string;
}
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
  token:string|null
}
export interface User {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  playlist: string[] | number[];
  role: string;
  isVerified: boolean;
  token:string|null
}
