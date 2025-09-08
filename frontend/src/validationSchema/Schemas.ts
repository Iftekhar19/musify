import {z} from "zod";

// 🔹 Validation schema
export const SigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const ResetPasswordformSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

  export const updateCategorySchema=z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.string().url("Must be a valid URL").optional(),
});
export const albumSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string("Description must be at least 5 characters").optional(),
  category_id: z.string().min(1, "Please select a category"),
  thumbnail: z
    .any()
    .refine((file) => file?.length > 0, "Thumbnail image is required"),
});
export const categorySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.any().optional(),
});
export const songSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string("Description is required").optional(),
  thumbnail: z.any().optional(),
  audio: z.any().refine((file) => file && file.length > 0, {
    message: "Audio file is required",
  }),
  album_id: z.string().min(1, "Album is required"),
  category_id: z.string().min(1, "Category is required"),
});