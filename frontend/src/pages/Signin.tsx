import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

const Signin = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Apply/remove dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center bg-background px-4 transition-colors">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl border rounded-2xl">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    required
                  />
                </div>
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
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Links */}
              <div className="flex justify-between text-sm">
                <Link to={'/forgot-password'} className="px-0 underline font-semibold">
                  Forgot password?
                </Link>
                <Link to={'/signup'} className="px-0 underline font-semibold">
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
