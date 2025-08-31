import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "Unexpected Error";
  let message = "Something went wrong. Please try again later.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you are looking for does not exist.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || "An error occurred.";
    }
  }

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full shadow-xl border rounded-2xl p-6 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{message}</p>

          <Button asChild className="mt-4 rounded-xl">
            <a href="/">
              <Home className="h-4 w-4 mr-2" /> Go Home
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
