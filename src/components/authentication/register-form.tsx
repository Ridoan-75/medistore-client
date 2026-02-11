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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
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
  ArrowRight,
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
      const { error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

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

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === formData.role);

  return (
    <Card className="w-full max-w-md mx-auto border-2 shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
          <UserPlus className="h-8 w-8 text-white" />
        </div>

        <CardTitle className="text-2xl md:text-3xl font-bold">
          Create Account
        </CardTitle>

        <CardDescription className="text-base">
          Join MediStore today
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="h-12 border-2 focus:border-primary"
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="h-12 border-2 focus:border-primary"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              {selectedRole && <selectedRole.icon className="h-4 w-4 text-muted-foreground" />}
              Account Type
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="h-12 border-2 focus:border-primary">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 font-medium">
              <Lock className="h-4 w-4 text-muted-foreground" />
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
                className="h-12 pr-12 border-2 focus:border-primary"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="space-y-1 pt-1">
              {PASSWORD_REQUIREMENTS.map((req) => (
                <div
                  key={req}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white font-semibold text-base shadow-lg shadow-primary/25 transition-all"
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full h-12 border-2 font-semibold text-base"
        >
          <Link href="/login">
            Sign in instead
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}