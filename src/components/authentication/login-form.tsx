"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  ArrowRight,
  UserPlus,
  Shield,
} from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "../ui/use-toast";

interface LoginFormData {
  email: string;
  password: string;
}

// Extend the user type to include role
interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  emailVerified: boolean;
}

const INITIAL_FORM_DATA: LoginFormData = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(formData.email)
    console.log(formData.password)

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("data", data)

      // ✅ SUCCESS - Get user data
      const user = data?.user as UserWithRole;
      
      // ✅ Save user to localStorage for useAuth hook
      if (user) {
        localStorage.setItem('medistore_user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
        }));
      }
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user?.name || user?.email}`,
      });

      if(user){
        router.push("/")
      }
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <Card className="w-full max-w-md mx-auto border-2 shadow-xl rounded-2xl">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>

        <CardTitle className="text-3xl font-bold text-gray-900">
          Welcome Back
        </CardTitle>

        <CardDescription className="text-base text-gray-600">
          Sign in to your MediStore account
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="flex items-center gap-2 font-semibold text-gray-700"
            >
              <Mail className="h-4 w-4 text-green-600" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-12 border-2 focus:border-green-600 rounded-xl"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="password" 
                className="flex items-center gap-2 font-semibold text-gray-700"
              >
                <Lock className="h-4 w-4 text-green-600" />
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="h-12 pr-12 border-2 focus:border-green-600 rounded-xl"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-base shadow-lg rounded-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">
              Dont have an account?
            </span>
          </div>
        </div>

        {/* Register Button */}
        <Button
          asChild
          variant="outline"
          className="w-full h-12 border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 font-semibold text-base rounded-xl transition-all"
        >
          <Link href="/register">
            <UserPlus className="h-5 w-5 mr-2" />
            Create an account
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </Button>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-green-600 hover:underline font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-green-600 hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}