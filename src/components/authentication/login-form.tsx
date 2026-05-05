"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
} from "lucide-react";
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
} from "@/src/lib/auth";
import { toast } from "../ui/use-toast";

interface LoginFormData {
  email: string;
  password: string;
}

type AuthError = {
  code?: string;
};

const INITIAL_FORM_DATA: LoginFormData = {
  email: "",
  password: "",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<"google" | "facebook" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await loginWithEmail(formData.email.trim(), formData.password);
      toast({ title: "Welcome back!", description: `Logged in as ${user.displayName || user.email}` });
      window.dispatchEvent(new Event("auth-changed"));
      setTimeout(() => { router.push("/"); router.refresh(); }, 300);
    } catch (error: unknown) {
      const err = error as AuthError;
      let message = "Invalid email or password";
      if (err.code === "auth/too-many-requests") message = "Too many attempts. Please try again later.";
      toast({ title: "Login failed", description: message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSocialLoading("google");
    try {
      const user = await loginWithGoogle();
      toast({ title: "Welcome!", description: `Logged in as ${user.displayName || user.email}` });
      window.dispatchEvent(new Event("auth-changed"));
      setTimeout(() => { router.push("/"); router.refresh(); }, 300);
    } catch (error: unknown) {
      toast({ title: "Google login failed", description: "Could not sign in with Google.", variant: "destructive" });
      setIsSocialLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setIsSocialLoading("facebook");
    try {
      const user = await loginWithFacebook();
      toast({ title: "Welcome!", description: `Logged in as ${user.displayName || user.email}` });
      window.dispatchEvent(new Event("auth-changed"));
      setTimeout(() => { router.push("/"); router.refresh(); }, 300);
    } catch (error: unknown) {
      toast({ title: "Facebook login failed", description: "Could not sign in with Facebook.", variant: "destructive" });
      setIsSocialLoading(null);
    }
  };

  const isFormValid = formData.email.trim() && formData.password.trim();
  const isSocialBusy = isSocialLoading !== null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl bg-white dark:bg-gray-900">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/Logo.png" alt="MediStore Logo" width={80} height={80} className="object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to your MediStore account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isSocialBusy}
              className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSocialLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Google
            </button>

            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isLoading || isSocialBusy}
              className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSocialLoading === "facebook" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FacebookIcon />}
              Facebook
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="h-3.5 w-3.5 text-emerald-600" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 pr-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isFormValid || isSocialBusy}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">Don&apos;t have an account?</span>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full h-11 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all"
          >
            <Link href="/register">
              <UserPlus className="h-4 w-4 mr-2" />
              Create an account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}