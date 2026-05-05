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
  User,
  UserPlus,
  Loader2,
  Store,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { registerWithEmail, loginWithGoogle, loginWithFacebook } from "@/src/lib/auth";
import { updateProfile, User as FirebaseUser } from "firebase/auth";
import { Roles } from "@/src/constants/roles";
import { toast } from "@/src/hooks/use-toast";

type UserRole = typeof Roles.CUSTOMER | typeof Roles.SELLER;

type AuthError = {
  code?: string;
};

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof User;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: Roles.CUSTOMER,
    label: "Customer",
    description: "Buy healthcare products",
    icon: ShoppingBag,
  },
  {
    value: Roles.SELLER,
    label: "Seller",
    description: "Sell your products",
    icon: Store,
  },
];

const INITIAL_FORM_DATA: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  role: Roles.CUSTOMER,
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

export function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<"google" | "facebook" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const syncUser = async (user: FirebaseUser, name?: string, role?: UserRole) => {
    const token = await user.getIdToken(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name || user.displayName, role: role || Roles.CUSTOMER }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await registerWithEmail(formData.email.trim(), formData.password);
      await updateProfile(user, { displayName: formData.name.trim() });
      await syncUser(user, formData.name.trim(), formData.role);
      toast({ title: "Account created!", description: "Please login with your credentials." });
      router.push("/login");
      router.refresh();
    } catch (error: unknown) {
      const err = error as AuthError;
      let message = "An unexpected error occurred. Please try again.";
      if (err.code === "auth/email-already-in-use") message = "This email is already registered.";
      else if (err.code === "auth/weak-password") message = "Password must be at least 6 characters.";
      toast({ title: "Registration failed", description: message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsSocialLoading(provider);
    try {
      const user = provider === "google" ? await loginWithGoogle() : await loginWithFacebook();
      await syncUser(user);
      toast({ title: "Account created!", description: `Welcome, ${user.displayName || user.email}` });
      window.dispatchEvent(new Event("auth-changed"));
      setTimeout(() => { router.push("/"); router.refresh(); }, 300);
    } catch (error: unknown) {
      toast({
        title: `${provider === "google" ? "Google" : "Facebook"} sign-up failed`,
        description: "Could not create account. Please try again.",
        variant: "destructive",
      });
      setIsSocialLoading(null);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.password.length >= 8;

  const isBusy = isLoading || isSocialLoading !== null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl bg-white dark:bg-gray-900">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/Logo.png" alt="MediStore Logo" width={80} height={80} className="object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join MediStore today
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleSocialLogin("google")} disabled={isBusy} className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSocialLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Google
            </button>

            <button type="button" onClick={() => handleSocialLogin("facebook")} disabled={isBusy} className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSocialLoading === "facebook" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FacebookIcon />}
              Facebook
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="h-3.5 w-3.5 text-emerald-600" />
                Full Name
              </Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className="h-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400" required autoComplete="name" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="h-3.5 w-3.5 text-emerald-600" />
                Email Address
              </Label>
              <Input id="email" name="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} className="h-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400" required autoComplete="email" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.role === option.value;
                  return (
                    <button key={option.value} type="button" onClick={() => handleRoleChange(option.value)} className={`p-3.5 rounded-xl border-2 transition-all text-left ${isSelected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"}`}>
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? "bg-emerald-600" : "bg-gray-100 dark:bg-gray-800"}`}>
                          <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>{option.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                Password
              </Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.password} onChange={handleChange} className="h-11 pr-11 rounded-xl border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400" required autoComplete="new-password" />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                {["At least 8 characters long", "Contains letters and numbers"].map((req) => (
                  <div key={req} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${
                      req === "At least 8 characters long"
                        ? formData.password.length >= 8 ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"
                        : /[a-zA-Z]/.test(formData.password) && /[0-9]/.test(formData.password)
                          ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"
                    }`} />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isBusy || !isFormValid} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">Already have an account?</span>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full h-11 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all">
            <Link href="/login">Sign in instead</Link>
          </Button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}