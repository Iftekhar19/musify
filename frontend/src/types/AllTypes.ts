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
}