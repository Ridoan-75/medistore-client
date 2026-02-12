"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  link: string;
  image: string;
}

const SLIDES = [
  {
    id: 1,
    title: "Your Prescription for",
    subtitle: "Affordable Health Solutions!",
    description: "Exclusive discounts and convenience. Every purchase is a prescription for savings.",
    buttonText: "Start Shopping",
    link: "/shop",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Trusted Online",
    subtitle: "Medicine Store",
    description: "Get authentic medicines delivered fast at your doorstep with complete care.",
    buttonText: "Explore Products",
    link: "/shop",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Doctor Approved",
    subtitle: "Healthcare Essentials",
    description: "Shop medicines and wellness products with confidence and safety anytime.",
    buttonText: "Order Now",
    link: "/shop",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Fast Delivery",
    subtitle: "Right at Your Door",
    description: "Quick delivery with trusted packaging so your health stays protected.",
    buttonText: "Shop Today",
    link: "/shop",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&h=1000&fit=crop&q=80"
  },
  {
    id: 5,
    title: "Care & Support",
    subtitle: "24/7 Assistance",
    description: "Our support team is always ready to help you with your medical needs.",
    buttonText: "Learn More",
    link: "/about",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=1000&fit=crop&q=80"
  },
];
export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) =>
      prev === 0 ? SLIDES.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <section className="w-full bg-gradient-to-br from-[#2d5f4f] to-[#1f4435] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#2f4b3b]/80 to-[#2f4b3b]/60 backdrop-blur-sm">
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]">

            {/* LEFT CONTENT */}
            <div className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6 text-center lg:text-left z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                {slide.title}
                <br />
                <span className="text-green-300">{slide.subtitle}</span>
              </h1>

              <p className="text-white/90 max-w-md mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed">
                {slide.description}
              </p>

              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#2d5f4f] hover:bg-green-50 px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Link href={slide.link}>{slide.buttonText}</Link>
                </Button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10">
              <div className="relative w-[240px] h-[300px] sm:w-[280px] sm:h-[350px] md:w-[320px] md:h-[400px] lg:w-[380px] lg:h-[480px]">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-2xl blur-2xl"></div>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 380px"
                  className="object-cover rounded-2xl shadow-2xl relative z-10 transition-opacity duration-500"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-20">

            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 p-2 sm:p-2.5 rounded-full transition-all backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5 sm:gap-2">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-6 sm:w-8 bg-green-400"
                      : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 p-2 sm:p-2.5 rounded-full transition-all backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>
      </div>
    </section>
  );
}