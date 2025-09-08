

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {Link, useNavigate, useSearchParams} from "react-router-dom"
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";


export default function VerifyAccount() {
     const {value}=useAuth();
     const navigate=useNavigate()
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
 const [searchParams]=useSearchParams()
  const handleVerify = async () => {
    try {
     setLoading(true)
     const userId=   searchParams.get("userId")
     const token=   searchParams.get("token")
     await  axios.post(`http://localhost:8000/api/v1/users/verify-account?token=${token}&userId=${userId}`)
      setSuccess(true)
    } catch (error) {
      const AxiosError=error as AxiosError<ApiResponse>
      console.error("Verification failed:", AxiosError.message);
      toast.error(AxiosError.message,{position:"top-right"})
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
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="max-w-[350px] w-full p-6 shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-6">
          {!success ? (
            <>
              <p className="text-lg font-medium text-center">
                Click below to verify your account
              </p>
              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-lg font-semibold text-green-600">
                Account Verified Successfully! <Link to={`/signin`} className="inline-block ml-2 underline ">login</Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
