"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

// ✅ Zod schema
const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;



export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
 const {value}=useAuth();
 const navigate=useNavigate()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
       await axios.post(`http://localhost:8000/api/v1/users/reset-password-link`,{
        email:values.email
      })
      setLinkSent(true);
    } catch (err) {
     const AxiosError = err as AxiosError<ApiResponse>;
      console.error("Password reset failed", AxiosError);
      toast.error(AxiosError.message)
    } finally {
      setLoading(false);
    }
  };
    useEffect(()=>
    {
    
     if(value)
     {
      navigate('/')
     }
     
    },[])

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px] rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!linkSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Input */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="Enter your email"
                            className="pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-lg font-medium text-green-600 text-center">
                Password reset link has been sent!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
