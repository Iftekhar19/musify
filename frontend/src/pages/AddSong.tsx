"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthProvider";
import { songSchema } from "@/validationSchema/Schemas";
import axios from "axios";
import { Loader2, Music } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


type SongFormValues = z.infer<typeof songSchema>;

const AddSong = () => {
  const [loading, setLoading] = useState(false);
  const [catId,setCatId]=useState<string|number|null>(null)

  const {user,albums,categories}=useAuth()
  const navigate=useNavigate();
  const form = useForm<SongFormValues>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: "",
      description: "",
      album_id: "",
      category_id: "",
    },
  });

  const onSubmit = async (values: SongFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      const songData = {
        title: values.title,
        description: values.description,
        album: Number(values.album_id),
        category: Number(catId),
      };
      // console.log(songData)
      // console.log(values.audio[0])
      // setLoading(false);
      // return;

      formData.append("data", JSON.stringify(songData));

      // const file=[];
      // if (values.thumbnail && values.thumbnail[0]) {
       
      //   file.push(values.thumbnail[0])
      // }
      if (values.audio && values.audio[0]) {
        
        // file.unshift(values.audio[0])
        formData.append("file",values.audio[0])
      }
      // if(file.length==1)
      // {
      //   formData.append("file",file[0])
      // }
      // else{
      //   formData.append("file",file)
      // }

      // const res = await fetch("http://localhost:5000/api/songs", {
      //   method: "POST",
      //   body: formData,
      // });
      await axios.post(`http://localhost:8001/api/v1/admin/upload/song`,formData,{
        headers:{
          token:user?.token||""
        },
        withCredentials:true
      })

      // const result = await res.json();
      // console.log("Song created:", result);
      toast.success("Song created successfully!",{position:"top-right"});
      form.reset();
    } catch (error) {
      console.error(error);
      toast.success("Failed to create song",{position:"top-right"});
    } finally {
      setLoading(false);
    }
  };
  const filterCategory=(id:string|number)=>
  {
     const al=albums?.find((a)=>a.id==id)
     const cate=categories.find((c)=>c.title==al?.category)
     if(cate)
     {
      setCatId(cate.id)
      // alert(cate.id)
     }
  }
  useEffect(()=>
  {
    if(!user)navigate(-1)
    if(user && user?.role=="user") navigate(-1)
  },[])
  return (
    <div className="h-full w-full flex justify-center items-center px-2 py-4 mt-2">
      <div className="max-w-[600px] w-full">
        <Card className="shadow-lg rounded-xl border">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Add Song
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Song Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter song title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Enter song description"
                          {...field}
                          className="resize-none"
                          
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Album */}
                <FormField
                  control={form.control}
                  name="album_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value)=>
                          {
                             filterCategory(value)
                             field.onChange(value)
                          }
                          }
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an album" />
                          </SelectTrigger>
                          <SelectContent>
                            {albums?.map((album) => (
                              <SelectItem
                                key={album.id}
                                value={album.id.toString()}
                              >
                                {album.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full" disabled>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id.toString()}
                              >
                                {cat.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thumbnail */}
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            field.onChange(e.target.files ? e.target.files : [])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Audio */}
                <FormField
                  control={form.control}
                  name="audio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={(e) =>
                            field.onChange(e.target.files ? e.target.files : [])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      Create Song
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddSong;
