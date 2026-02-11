"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Clock,
} from "lucide-react";

interface SideBanner {
  image: string;
  label: string;
  title: string;
  priceRange: string;
  link: string;
  gradient: string;
}

interface TrustBadge {
  icon: typeof ShieldCheck;
  text: string;
}

const SIDE_BANNERS: SideBanner[] = [
  {
    image: "/images/hero-medicine.jpg",
    label: "Best Sellers",
    title: "Medicine Products",
    priceRange: "৳100 - ৳500",
    link: "/shop?category=medicine",
    gradient: "from-blue-600/80 to-blue-900/60",
  },
  {
    image: "/images/hero-living.jpg",
    label: "New Arrival",
    title: "Healthcare Devices",
    priceRange: "৳1,200 - ৳1,400",
    link: "/shop?category=devices",
    gradient: "from-purple-600/80 to-purple-900/60",
  },
];

const TRUST_BADGES: TrustBadge[] = [
  { icon: ShieldCheck, text: "100% Authentic" },
  { icon: Truck, text: "Free Delivery" },
  { icon: Clock, text: "24/7 Support" },
];

export function Hero() {
  return (
    <section className="py-6 md:py-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[400px] md:min-h-[500px] group">
            <Image
              src="/images/hero-thermometer.jpg"
              alt="Digital Thermometer for Healthcare"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 w-fit mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-white/90 text-sm font-medium">
                  Home Medical Supplies
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 max-w-xl leading-[1.1] tracking-tight">
                Fast Reading{" "}
                <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Digital Thermometer
                </span>{" "}
                for Ear & Forehead
              </h1>

              <p className="text-white/80 text-base md:text-lg mb-6 max-w-md leading-relaxed">
                Accurate temperature readings in seconds. FDA approved, safe for
                all ages, and trusted by healthcare professionals.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                {TRUST_BADGES.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.text}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-white/90 text-xs font-medium">
                        {badge.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white shadow-lg shadow-primary/30 font-semibold text-base h-12 px-6"
                >
                  <Link href="/shop">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold text-base h-12 px-6 backdrop-blur-sm"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-white/70 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            {SIDE_BANNERS.map((banner, index) => (
              <Link
                key={index}
                href={banner.link}
                className="relative rounded-2xl overflow-hidden flex-1 min-h-[200px] md:min-h-[240px] group"
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-t ${banner.gradient}`}
                />

                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full w-fit text-white/90 text-xs font-medium mb-2">
                    <Sparkles className="h-3 w-3" />
                    {banner.label}
                  </span>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {banner.title}
                  </h3>

                  <p className="text-white/80 text-sm mb-3">
                    {banner.priceRange}
                  </p>

                  <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:text-primary transition-colors">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}