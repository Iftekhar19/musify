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
import { Loader2, Upload } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";
import { categorySchema } from "@/validationSchema/Schemas";
import { useNavigate } from "react-router-dom";

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
 const navigate=useNavigate()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: undefined,
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      //   // Append category JSON
      const categoryData = {
        title: values.title,
        description: values.description || "",
      };
      formData.append("data", JSON.stringify(categoryData));

      // Append image (optional)
      if (values.thumbnail && values.thumbnail[0]) {
        formData.append("file", values.thumbnail[0]);
      }

      const { data } = await axios.post(
        `http://localhost:8001/api/v1/admin/add/category`,
        formData,
        {
          headers: {
            token: user?.token || "",
          },
          withCredentials: true,
        }
      );

      console.log("Category created:", data);
      toast.success("Category created successfully!", {
        position: "top-right",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create category", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
    useEffect(()=>
    {
      if(!user)navigate(-1)
      if(user && user?.role=="user") navigate(-1)
      // if(user && user.role!=="admin")
      // {
      //   navigate(-1)
      // }
      
  
    },[])
  return (
    <div className="h-full w-full flex justify-center items-center py-4 px-2">
      <div className="max-w-[500px] w-full">
        <Card className="shadow-lg rounded-xl border">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Add Category
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
                      <FormLabel>Category Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category title" {...field} />
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
                          placeholder="Enter category description (optional)"
                          {...field}
                        />
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

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Category
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

export default AddCategory;
