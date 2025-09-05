import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
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
import {
  Lock,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/ApiResponse";
import { ResetPasswordformSchema } from "@/validationSchema/Schemas";
import { useAuth } from "@/context/AuthProvider";

type FormValues = z.infer<typeof ResetPasswordformSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
   const {value}=useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const userId = searchParams.get("userId") || "";

  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ResetPasswordformSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
    useEffect(()=>
  {
  
   if(value)
   {
    navigate('/dashboard')
   }
   
  },[])

  useEffect(() => {
    const validate = async () => {
      try {
        const { data } = await axios.post(
          `http://localhost:8000/api/v1/users/verify-reset-password-link?token=${token}&userId=${userId}`
        );
        setValid(data.success);
      } catch (error) {
        setValid(false);
      } finally {
        setValidating(false);
      }
    };
    validate();
  }, [token]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8000/api/v1/users/reset-password`, {
        userId: userId,
        password: values.password,
      });

      setDone(true);
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      const AxiosError = err as AxiosError<ApiResponse>;
      console.error("Reset failed", AxiosError.message);
      toast.error(AxiosError.message, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px] rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validating ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-600">Validating your reset link...</p>
            </div>
          ) : !valid ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <ShieldAlert className="h-10 w-10 text-red-500" />
              <p className="text-lg font-medium text-red-600 text-center">
                Invalid or expired reset link.
              </p>
            </div>
          ) : !done ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="pl-9 pr-9"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter password"
                            className="pl-9 pr-9"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowConfirm(!showConfirm)}
                          >
                            {showConfirm ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
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
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-lg font-medium text-green-600 text-center">
                Password reset successful!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
