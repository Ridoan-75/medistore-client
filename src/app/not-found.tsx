"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  ArrowLeft,
  Home,
  AlertCircle,
  Search,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";

interface QuickLink {
  label: string;
  href: string;
  icon: typeof Home;
}

const QUICK_LINKS: QuickLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Contact", href: "/contact", icon: HelpCircle },
];

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-2xl w-full text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl scale-75" />
          <div className="relative">
            <Image
              src="https://illustrations.popsy.co/gray/crashed-error.svg"
              alt="404 Error Illustration"
              width={350}
              height={280}
              className="mx-auto"
              priority
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
          <Search className="h-4 w-4 text-primary" />
          <span className="text-primary font-medium text-sm">Error 404</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Page{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Not Found
          </span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl mb-6 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 text-amber-600 dark:text-amber-400">
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Under Development</p>
              <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                Some features are still being built.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 border-2 text-base font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>

          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 text-base font-semibold"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Or try one of these pages:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-all"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}