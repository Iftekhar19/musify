
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";
import { albumSchema } from "@/validationSchema/Schemas";
import type { categoryStructure } from "@/types/AllTypes";
// interface categoryStructure{
//   id:number|string;
//   description:number|string|null;
//   thumbnail:string|null;
//   title:string|null;
//   created_at:string|null
// }

type AlbumFormValues = z.infer<typeof albumSchema>;

const AddAlbum = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories,setCategories]=useState<categoryStructure[]>([]);
  const {user}=useAuth()

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: "",
      description: "",
      category_id: "",
      thumbnail: undefined,
    },
  });

  const onSubmit = async (values: AlbumFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append album JSON
      const albumData = {
        title: values.title,
        description: values.description,
        category_id: Number(values.category_id),
      };
      formData.append("data", JSON.stringify(albumData));

      // Append image
      if (values.thumbnail && values.thumbnail[0]) {
        formData.append("file", values.thumbnail[0]);
      }

      // Example API call
      // const res = await fetch("http://localhost:5000/api/albums", {
      //   method: "POST",
      //   body: formData,
      // });

      await axios.post(`http://localhost:8001/api/v1/admin/upload/album`,formData,{
        headers:{
          token:user?.token||""
        },
        withCredentials:true
      })

      // const result = await res.json();
      // console.log("Album created:", result);
      toast.success("Album created successfully!",{position:"top-right"});
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create album",{position:"top-right"});
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>
  {
    (async()=>
    {
   try {
     const {data}=await  axios.get(`http://localhost:8001/api/v1/admin/categories`,{
         headers:{
           token:user?.token||""
         },
         withCredentials:true
       })
       setCategories(data.categories)
   } catch (error) {
    console.log(error)
    toast.error("Unable to fetch categories",{position:"top-right"})
   }
    })()

  },[])

  return (
    <div className="h-full w-full flex justify-center items-center py-4 px-2">
      <div className="max-w-[500px] w-full">
        <Card className="shadow-lg rounded-xl border">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Add Album
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
                      <FormLabel>Album Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter album title" {...field} />
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
                          rows={3}
                          placeholder="Enter album description"
                          {...field}
                        />
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* In real app: map categories from API */}
                          {categories.map((cat)=>(

                          <SelectItem value={String(cat.id)} key={cat.id} className="capitalize">{cat.title}</SelectItem>
                          ))}
                         
                        </SelectContent>
                      </Select>
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
                      <FormLabel>Thumbnail</FormLabel>
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Album
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

export default AddAlbum;
