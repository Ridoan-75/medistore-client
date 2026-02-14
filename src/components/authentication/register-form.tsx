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
  CheckCircle,
} from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { Roles } from "@/src/constants/roles";
import { toast } from "@/src/hooks/use-toast";

type UserRole = typeof Roles.CUSTOMER | typeof Roles.SELLER;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface SignUpParams {
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

const PASSWORD_REQUIREMENTS = [
  "At least 8 characters long",
  "Contains letters and numbers",
];

const INITIAL_FORM_DATA: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  role: Roles.CUSTOMER,
};

export function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const signUpData: SignUpParams = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };
      
      const { error } = await authClient.signUp.email(signUpData as Parameters<typeof authClient.signUp.email>[0]);

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Account created!",
        description: "Please login with your credentials.",
      });

      router.push("/login");
      router.refresh();
    } catch {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.password.length >= 8;

  return (
    <Card className="w-full max-w-md mx-auto border-2 shadow-xl rounded-2xl">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Image 
            src="/images/Logo.png" 
            alt="MediStore Logo" 
            width={120} 
            height={120}
            className="object-contain"
          />
        </div>

        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </CardTitle>

        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
          Join MediStore today
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-emerald-600" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-600 dark:focus:border-emerald-500 rounded-lg"
              required
              autoComplete="name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-emerald-600" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-600 dark:focus:border-emerald-500 rounded-lg"
              required
              autoComplete="email"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              Account Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.role === option.value;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleRoleChange(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? "bg-emerald-600"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            isSelected
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            isSelected
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Lock className="h-4 w-4 text-emerald-600" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="h-11 pr-10 border-gray-300 dark:border-gray-600 focus:border-emerald-600 dark:focus:border-emerald-500 rounded-lg"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="space-y-1.5 pt-2">
              {PASSWORD_REQUIREMENTS.map((req) => (
                <div
                  key={req}
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Button */}
        <Button
          asChild
          variant="outline"
          className="w-full h-11 border-gray-300 dark:border-gray-600 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-semibold rounded-lg"
        >
          <Link href="/login">
            Sign in instead
          </Link>
        </Button>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-emerald-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-emerald-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}