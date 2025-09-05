import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import type { ApiResponse } from "@/types/ApiResponse";
import { SigninSchema } from "@/validationSchema/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import axios from "axios";
import { Lock, Mail } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

type SigninFormData = z.infer<typeof SigninSchema>;

const Signin = () => {
  const navigate=useNavigate()
  const {setUser,setValue,value,user} =useAuth()
  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
  });

  // Apply/remove dark mode class on <html>
  useEffect(() => {
    const darkMode = localStorage.getItem("theme") == "dark";
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  useEffect(()=>
  {
  
   if(value)
   {
    navigate('/dashboard')
   }
   
  },[user])

  const onSubmit = async (userData: SigninFormData) => {
    console.log("✅ Signin Data:", userData);
   try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/users/signin`,
        {
         ...userData,
         
        },{
          withCredentials:true
        }
      );
       setUser(data.user);
       if (setValue) {
         setValue(data.user);
         setUser(data.user)
       }
      toast.success("Login successfully",{
        position:'top-right'
      })
   } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error(axiosError.response?.data?.message||"Unexpected error",{
      position:"top-right"
    })
    console.log(error)
    console.log(axiosError.response?.data?.message)
   }
    // fake delay to simulate login
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center bg-background px-4 transition-colors">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl border rounded-2xl">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-center w-full">Sign In</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>

              {/* Links */}
              <div className="flex justify-between text-sm">
                <Link
                  to={"/forgot-password"}
                  className="px-0 underline font-semibold"
                >
                  Forgot password?
                </Link>
                <Link to={"/signup"} className="px-0 underline font-semibold">
                  Create account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
