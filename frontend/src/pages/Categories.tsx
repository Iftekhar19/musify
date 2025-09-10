"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import ConfirmDeleteDialog from "@/components/DeleteDialog";
import { toast } from "sonner";
import type { categoryStructure } from "@/types/AllTypes";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  created_at: string;
}

const categorySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  thumbnail: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof FileList && file.length > 0),
      "Thumbnail must be an image file"
    ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoryTable = () => {
  const { user,categories } = useAuth();
  // const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<categoryStructure|null>(
    null
  );
  const [open, setOpen] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
 const navigate=useNavigate()
  // ✅ Fetch categories
  // useEffect(() => {
  //   async function fetchCategories() {
  //     try {
  //       const { data } = await axios.get("http://localhost:8002/api/v1/categories",);
  //       // const data = await res.json();
  //       setCategories(data.categories);
  //     } catch (error) {
  //       // console.log(error?.message)
  //       console.error(error);
  //     }
  //   }
  //   fetchCategories();
  // }, []);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: undefined,
    },
  });

  const handleEdit = (cat: categoryStructure) => {
    setSelectedCategory(cat);
    form.reset({
      title: cat.title||undefined,
      description: typeof cat.description === "number"
        ? String(cat.description)
        : cat.description || undefined,
      thumbnail: null,
    });
    setOpen(true);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    console.log(values);
    if (!selectedCategory) return;
    setLoading(true);
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: values.title,
        description: values.description || "",
      })
    );

    if (values.thumbnail && values.thumbnail[0]) {
      formData.append("file", values.thumbnail[0]);
    }
    console.log(formData);

    try {
      const { data } = await axios.patch(
        `http://localhost:8001/api/v1/admin/update/category/${selectedCategory.id}`,
        formData,
        {
          headers: {
            token: user?.token || "",
          },
          withCredentials: true,
        }
      );
      // setCategories((prev) =>
      //   prev.map((cat) =>
      //     cat.id === selectedCategory.id
      //       ? { ...cat, ...values, thumbnail: data.result?.thumbnail || "" }
      //       : cat
      //   )
      // );
      toast.success("Updated successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category:", { position: "top-right" });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  const handleDelete = async (id: string | number | null) => {
    try {
      //   alert(id);
      // setLoading(true);
      // simulate API call
      await axios.delete(
        `http://localhost:8001/api/v1/admin/delete/category/${selectedCategory?.id}`,
        {
          headers: {
            token: user?.token || "",
          },
        }
      );
      console.log("Album deleted:", id);
      //   setOpenDialog(false);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      // setLoading(false);
    }
  };
    useEffect(()=>
    {
      if(!user)navigate(-1)
      if(user && user?.role=="user") navigate(-1)
    },[])

  return (
    <div className="w-full px-2">
      {/* Desktop Table */}
      <div className=" mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className=" ">Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>
                  {cat.thumbnail ? (
                    <img
                      src={cat.thumbnail}
                      alt={cat.title||""}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{cat.title}</TableCell>
                <TableCell>{cat.description || "NA"}</TableCell>
                <TableCell>
                  {new Date(cat.created_at||"").toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(cat)}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpen2(true);
                    }}
                    size="sm"
                    className="cursor-pointer"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          {/* Entire form is inside DialogContent */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...form.register("description")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="thumbnail">Thumbnail(optional)</Label>
              <Input
                id="thumbnail"
                {...form.register("thumbnail")}
                accept="image/*"
                type="file"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>{loading?<><Loader2 className="h-6 w-6 animate-spin"/>Updating...</>:"Update"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        onOpenChange={setOpen2}
        open={open2}
        onConfirm={() => handleDelete(1)}
      />
    </div>
  );
};

export default CategoryTable;
